import { Button } from "@/components/ui/button";
import { OrderItem } from "../containers/AdminDashboard";

interface ShoppingCardModalProps {
  order: OrderItem[];
}

const ShoppingCardModal = (props: ShoppingCardModalProps) => {
  const { order } = props;

  return (
    <div className="fixed top-16 right-4 w-80 dark:bg-neutral-900 shadow-md rounded-md overflow-hidden z-50">
      <div className="bg-gray-800 text-white p-3 font-bold">Your Order</div>
      <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
        {order.length === 0 ? (
          <p className="text-gray-400">Your cart is empty</p>
        ) : (
          order.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-2 text-white"
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))
        )}
        {order.length > 0 && (
          <div className="mt-4 pt-2 border-t border-gray-700">
            <div className="flex justify-between items-center text-white font-bold">
              <span>Total:</span>
              <span>
                $
                {order
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
            <Button className="w-full mt-2 bg-green-500 hover:bg-green-600">
              Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCardModal;
