import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { MenuItem } from "./MenuItemCard";

export interface OrderItem extends MenuItem {
  quantity: number;
}

interface MenuCartProps {
  order: OrderItem[];
  isOpen: boolean;
  onToggle: () => void;
  onUpdateQuantity: (name: string, quantity: number) => void;
}

export default function MenuCart({
  order,
  isOpen,
  onToggle,
  onUpdateQuantity,
}: MenuCartProps) {
  return (
    <>
      <div
        className="fixed top-4 right-4 bg-gray-900 text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition-colors z-50"
        onClick={onToggle}
      >
        <ShoppingCart size={24} />
        {order.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {order.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="fixed top-16 right-4 w-80 bg-gray-900 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="bg-gray-800 text-white p-3 font-bold">Tu orden</div>
          <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
            {order.length === 0 ? (
              <p className="text-gray-400">Tu carrito esta vacio</p>
            ) : (
              order.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-4 text-white"
                >
                  <div className="flex-grow">
                    <p>{item.name}</p>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() =>
                          onUpdateQuantity(item.name, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() =>
                          onUpdateQuantity(item.name, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-2"
                        onClick={() => onUpdateQuantity(item.name, 0)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
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
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
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
      )}
    </>
  );
}
