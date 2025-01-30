import { differenceInDays, parseISO } from 'date-fns';

export const calculateStatus = (deliveryDate: string, isDelivered?: boolean): 'on_time' | 'upcoming' | 'delayed' | 'delivered' => {
  if (isDelivered) return 'delivered';
  
  const today = new Date();
  const delivery = parseISO(deliveryDate);
  const daysUntilDelivery = differenceInDays(delivery, today);

  if (daysUntilDelivery < 0) return 'delayed';
  if (daysUntilDelivery <= 10) return 'upcoming';
  return 'on_time';
};