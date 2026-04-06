import redis from './redis';

export interface OrderStatusEvent {
  orderId: string;
  orderStatus: string;
  riderId?: string;
  updatedAt: string;
}

/**
 * Emit an order status change event using Redis Pub/Sub.
 */
export async function emitOrderStatusChange(event: OrderStatusEvent): Promise<void> {
  const channel = `order:${event.orderId}`;
  await redis.publish(channel, JSON.stringify(event));

  // Also publish to admin live feed
  await redis.publish('admin:live-feed', JSON.stringify({
    type: 'order_status_change',
    data: event,
    timestamp: Date.now()
  }));
}
