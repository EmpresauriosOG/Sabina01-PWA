export interface Ingredient {
  expiration: number | string;
  location_id: string;
  min_stock: number;
  name: string;
  restaurant_id: string;
  stock: number | string;
  type: string;
  unit: string;
  id: string;
  itemName?: string;
}
