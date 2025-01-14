export interface MenuIngredient {
    ingredient_id: string;
    quantity: number;
  }
  
  export interface MenuItem {
    id?: string;
    name: string;
    short_description: string;
    long_description: string;
    price: number;
    image: string;
    attributes: string[];
    course_type: string;
    meal_type: string;
    ingredients: MenuIngredient[];
    is_active: number;
    restaurant_id: string;
    location_id: string;
  }
  