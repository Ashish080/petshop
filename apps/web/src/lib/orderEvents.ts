import redis from './redis';
import { ORDER_STATE_MACHINE, OrderStatus } from '../config/order-states';

export interface OrderStatusEvent {
  orderId: string;
  orderStatus: string;
  missionLog?: string;
  riderId?: string;
  updatedAt: string;
}

/**
 * Emit an order status change event using Redis Pub/Sub.
 */
export async function emitOrderStatusChange(event: OrderStatusEvent): Promise<void> {
  const channel = `order:${event.orderId}`;
  
  if (!event.missionLog) {
    const config = ORDER_STATE_MACHINE[event.orderStatus as OrderStatus];
    if (config) {
      event.missionLog = config.missionLog;
    }
  }

  await redis.publish(channel, JSON.stringify(event));

  // Also publish to admin live feed
  await redis.publish('admin:live-feed', JSON.stringify({
    type: 'order_status_change',
    data: event,
    timestamp: Date.now()
  }));
}
