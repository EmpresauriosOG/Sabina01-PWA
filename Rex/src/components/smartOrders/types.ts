export interface MenuItem {
  name: string;
  short_description: string;
  price: number;
  image: string;
  course_type: string;
  id: string;
  isActive: number;
}

export interface OrderItem extends MenuItem {
  quantity: number;
  specialInstructions?: string;
}
