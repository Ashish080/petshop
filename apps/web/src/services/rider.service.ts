import redis from '../lib/redis';
import Order from '../models/Order';
import User from '../models/User';
import { z } from 'zod';
import { ServiceError } from './base.service';
import { isValidTransition, OrderStatus, ORDER_STATE_MACHINE } from '../config/order-states';
import { emitOrderStatusChange } from '../lib/orderEvents';

const KYCDetailsSchema = z.object({
  idType: z.string().min(2),
  idNumber: z.string().min(5),
  licenseNumber: z.string().min(5),
  vehicleType: z.enum(['cycle', 'bike', 'car']),
  vehiclePlate: z.string().min(3),
});

export class RiderService {
  /** Rider heartbeat — call every 10-30s from rider app */
  static async heartbeat(riderId: string, location: { lat: number; lng: number }) {
    const key = `rider:presence:${riderId}`;
    
    // 1. Set presence with 60s expiry
    await redis.setex(key, 60, JSON.stringify({
      riderId,
      location,
      lastSeen: new Date().toISOString(),
    }));
    
    // 2. Publish global location for general tracking
    await redis.publish(`rider:location:${riderId}`, JSON.stringify({
      riderId,
      ...location,
      timestamp: Date.now(),
    }));

    // 3. Find active orders and publish to individual order channels for customer radar
    const activeOrders = await Order.find({
      riderId,
      orderStatus: { $in: ['accepted', 'picked', 'out-for-delivery'] }
    }).select('_id').lean();

    for (const order of activeOrders) {
      await redis.publish(`order:${order._id.toString()}`, JSON.stringify({
        type: 'location_update',
        location,
        updatedAt: new Date().toISOString(),
      }));
    }

    // 4. Publish to admin live feed as well
    await redis.publish('admin:live-feed', JSON.stringify({
      type: 'rider_location_update',
      data: { riderId, location, timestamp: Date.now() },
      timestamp: Date.now()
    }));
  }

  static async getOrders(riderId: string, status?: string | null) {
    const query: any = {};
    
    if (status === 'available') {
      // Logic for available: assigned to this rider but not yet accepted
      query.orderStatus = { $in: ['confirmed', 'pending'] };
      query.riderId = riderId;
    } else if (status) {
      query.riderId = riderId;
      query.orderStatus = status;
    } else {
      // Default: currently active orders
      query.riderId = riderId;
      query.orderStatus = { $in: ['accepted', 'picked', 'out-for-delivery'] };
    }

    const orders = await Order.find(query).sort({ updatedAt: -1 }).lean();
    return orders.map(o => ({ ...o, _id: o._id.toString(), id: o._id.toString() }));
  }

  static async submitKYC(riderId: string, details: unknown) {
    const parsed = KYCDetailsSchema.safeParse(details);
    if (!parsed.success) {
       throw new ServiceError(parsed.error.issues[0].message, 'VALIDATION_ERROR', 400);
    }

    const user = await User.findByIdAndUpdate(
       riderId,
       { 
          $set: { 
             kycDetails: { ...parsed.data, verifiedAt: null },
             kycStatus: 'pending' 
          } 
       },
       { new: true, lean: true }
    );

    if (!user) throw new ServiceError('Rider not found', 'NOT_FOUND', 404);
    return user;
  }

  static async updateOrderStatus(riderId: string, orderId: string, targetStatus: OrderStatus) {
    const order = await Order.findById(orderId);
    if (!order) throw new ServiceError('Order not found', 'NOT_FOUND', 404);

    // Guard: Only assigned rider can update
    if (order.riderId?.toString() !== riderId) {
      throw new ServiceError('Order not assigned to you', 'FORBIDDEN', 403);
    }

    // State Machine Validation
    const transition = isValidTransition(order.orderStatus as OrderStatus, targetStatus, 'rider');
    if (!transition.valid) {
      throw new ServiceError(transition.reason || 'Invalid status transition', 'INVALID_TRANSITION', 400);
    }

    const config = ORDER_STATE_MACHINE[targetStatus];
    const updateOperation: any = { $set: { orderStatus: targetStatus } };

    if (config) {
      updateOperation.$push = {
        timeline: {
          status: targetStatus,
          message: config.missionLog,
          timestamp: new Date()
        }
      };
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateOperation,
      { returnDocument: 'after', lean: true }
    );

    if (!updatedOrder) throw new ServiceError('Update failed', 'UPDATE_FAILED', 500);

    // Push events
    emitOrderStatusChange({
      orderId,
      orderStatus: targetStatus,
      riderId,
      updatedAt: new Date().toISOString(),
    });

    return updatedOrder;
  }

  /** Get all online riders (using SCAN for production safety) */
  static async getOnlineRiders(): Promise<string[]> {
    const riders: string[] = [];
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', 'rider:presence:*', 'COUNT', 100);
      cursor = nextCursor;
      keys.forEach(k => {
        const id = k.split(':').pop();
        if (id) riders.push(id);
      });
    } while (cursor !== '0');
    return riders;
  }

  /** Check if rider is online */
  static async isOnline(riderId: string): Promise<boolean> {
    return (await redis.exists(`rider:presence:${riderId}`)) === 1;
  }
}
