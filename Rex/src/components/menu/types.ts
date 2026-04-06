// Full backend shape for a guest menu item.
// Source of truth consumed by getMenu.ts and all menu UI components.
export interface MenuItem {
  _id: string;
  restaurant_id: string;
  location_id: string;
  name: string;
  short_description: string;
  long_description: string;
  price: number;
  image: string;
  ingredients: Array<{
    ingredient_id: string;
    quantity: number;
  }>;
  attributes: string[];
  course_type: string;
  meal_type: string;
}
