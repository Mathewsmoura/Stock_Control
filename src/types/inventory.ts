export interface Product {
  id: string;
  product_code: string;
  product_name: string;
  request_code: string;
  order_number: string;
  department: string;
  delivery_date: string;
  observation?: string;
  created_at: string;
  status: 'on_time' | 'upcoming' | 'delayed' | 'delivered';
  is_delivered?: boolean;
}

export type ProductFormData = Omit<Product, 'id' | 'created_at' | 'status' | 'is_delivered'>;

export interface DashboardMetrics {
  statusDistribution: {
    onTime: number;
    upcoming: number;
    delayed: number;
    delivered: number;
  };
  departmentDistribution: {
    [key: string]: number;
  };
  deliveryTrends: {
    date: string;
    count: number;
  }[];
}