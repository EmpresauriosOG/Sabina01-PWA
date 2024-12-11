import { ShoppingCart } from "lucide-react";
import { OrderItem } from "../containers/AdminDashboard";

interface ShoppingCardbuttonProps {
  order: OrderItem[];
  isCartOpen: boolean;
  setIsCartOpen: (value: boolean) => void;
}

const ShoppingCardbutton = (props: ShoppingCardbuttonProps) => {
  return (
    <div
      className="fixed top-4 right-4 dark:bg-neutral-900 shadow-md rounded-md cursor-pointer  hover:bg-blue-600 transition-colors z-50"
      onClick={() => props.setIsCartOpen(!props.isCartOpen)}
    >
      <ShoppingCart size={24} />
      {props.order.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
          {props.order.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      )}
    </div>
  );
};

export default ShoppingCardbutton;
