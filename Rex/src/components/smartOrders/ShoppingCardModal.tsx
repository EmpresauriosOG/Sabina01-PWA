import { Button } from "@/components/ui/button";
import { OrderItem } from "../containers/AdminDashboard";

interface ShoppingCardModalProps {
  order: OrderItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onDiscardCart: () => void;
}

const ShoppingCardModal = (props: ShoppingCardModalProps) => {
  const { order } = props;

  return (
    <div className="fixed top-16 right-4 w-80 dark:bg-neutral-900 shadow-md rounded-md overflow-hidden z-50">
      <div className="p-3 font-bold">Resumen Orden</div>
      <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
        {order.length === 0 ? (
          <p className="text-gray-400">Carro Vacio!</p>
        ) : (
          order.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-2 text-white"
            >
              <div className="flex items-center gap-2">
                <span className="flex-1">
                  {item.name} x {item.quantity}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      props.onUpdateQuantity(index, item.quantity - 1)
                    }
                    className="w-6 h-6 rounded-full bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      props.onUpdateQuantity(index, item.quantity + 1)
                    }
                    className="w-6 h-6 rounded-full bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center"
                  >
                    +
                  </button>
                  <button
                    onClick={() => props.onRemoveItem(index)}
                    className="w-6 h-6 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
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
            <div className="flex gap-2 mt-2">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={props.onDiscardCart}
              >
                Descartar
              </Button>
              <Button className="flex-1"> Ordenar </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCardModal;
