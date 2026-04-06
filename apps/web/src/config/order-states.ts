/**
 * Order State Machine — Single source of truth
 * 
 * Defines valid transitions, allowed actors, and UI metadata.
 * Used by: API validation, admin UI, rider app, customer tracking.
 */

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'accepted'
  | 'picked'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled';

export type Actor = 'admin' | 'rider' | 'user' | 'system';

export interface StateConfig {
  transitions: OrderStatus[];
  actors: Actor[];
  label: string;
  color: string;
  icon: string;
  isTerminal: boolean;
  requiresRider: boolean;
}

export const ORDER_STATE_MACHINE: Record<OrderStatus, StateConfig> = {
  pending: {
    transitions: ['confirmed', 'cancelled'],
    actors: ['admin'],
    label: 'Pending Review',
    color: 'warning',
    icon: 'Clock',
    isTerminal: false,
    requiresRider: false,
  },
  confirmed: {
    transitions: ['accepted', 'cancelled'],
    actors: ['admin'],
    label: 'Confirmed',
    color: 'info',
    icon: 'CheckCircle',
    isTerminal: false,
    requiresRider: true, // Must assign rider before moving forward
  },
  accepted: {
    transitions: ['picked', 'cancelled'],
    actors: ['rider'],
    label: 'Rider Accepted',
    color: 'info',
    icon: 'UserCheck',
    isTerminal: false,
    requiresRider: false,
  },
  picked: {
    transitions: ['out-for-delivery'],
    actors: ['rider'],
    label: 'Picked Up',
    color: 'brand',
    icon: 'Package',
    isTerminal: false,
    requiresRider: false,
  },
  'out-for-delivery': {
    transitions: ['delivered'],
    actors: ['rider'],
    label: 'In Transit',
    color: 'brand',
    icon: 'Truck',
    isTerminal: false,
    requiresRider: false,
  },
  delivered: {
    transitions: [],
    actors: [],
    label: 'Delivered',
    color: 'success',
    icon: 'CheckCircle2',
    isTerminal: true,
    requiresRider: false,
  },
  cancelled: {
    transitions: [],
    actors: [],
    label: 'Cancelled',
    color: 'danger',
    icon: 'XCircle',
    isTerminal: true,
    requiresRider: false,
  },
};

/**
 * Ordered pipeline for progress visualization
 */
export const ORDER_PIPELINE: OrderStatus[] = [
  'pending',
  'confirmed',
  'accepted',
  'picked',
  'out-for-delivery',
  'delivered',
];

/**
 * Validate if a status transition is allowed
 */
export function isValidTransition(
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
  actor: Actor
): { valid: boolean; reason?: string } {
  const state = ORDER_STATE_MACHINE[currentStatus];

  if (!state) {
    return { valid: false, reason: `Unknown current status: ${currentStatus}` };
  }

  if (state.isTerminal) {
    return { valid: false, reason: `Cannot transition from terminal state: ${currentStatus}` };
  }

  if (!state.transitions.includes(targetStatus)) {
    return {
      valid: false,
      reason: `Invalid transition: ${currentStatus} → ${targetStatus}. Allowed: ${state.transitions.join(', ')}`,
    };
  }

  // Actor check
  if (actor !== 'admin') {
     // User can only cancel their own order if it's still pending
     if (actor === 'user') {
        if (targetStatus !== 'cancelled' || currentStatus !== 'pending') {
           return { valid: false, reason: 'Users can only cancel pending orders.' };
        }
        return { valid: true };
     }

     // Rider can only move to states where they are an allowed actor
     const targetState = ORDER_STATE_MACHINE[targetStatus];
     if (!targetState || !targetState.actors.includes(actor)) {
        return { valid: false, reason: `Role "${actor}" is not authorized to move order to "${targetStatus}".` };
     }
  }

  return { valid: true };
}

/**
 * Get the step index for pipeline progress (0-5)
 */
export function getPipelineStep(status: OrderStatus): number {
  if (status === 'cancelled') return -1;
  const idx = ORDER_PIPELINE.indexOf(status);
  return idx >= 0 ? idx : 0;
}

/**
 * Get available next statuses for a given actor
 */
export function getAvailableTransitions(
  currentStatus: OrderStatus,
  actor: Actor
): OrderStatus[] {
  const state = ORDER_STATE_MACHINE[currentStatus];
  if (!state || state.isTerminal) return [];

  // Admin can perform all transitions
  if (actor === 'admin') return state.transitions;

  // Others can only perform transitions where they're an allowed actor on the target
  return state.transitions.filter(target => {
    // Cancellation is always available to admin and sometimes user
    if (target === 'cancelled' && actor === 'user' && currentStatus === 'pending') return true;
    // Rider can perform rider transitions
    if (actor === 'rider' && ORDER_STATE_MACHINE[target].actors.includes('rider')) return true;
    return false;
  });
}
