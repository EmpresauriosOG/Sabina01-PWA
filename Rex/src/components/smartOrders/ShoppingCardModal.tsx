import { Button } from "@/components/ui/button";
import { OrderItem } from "../containers/AdminDashboard";
import { useState } from "react";
import { uploadOrder } from "@/utils/orderUtils";
import { useToast } from "@/components/ui/use-toast";

interface ShoppingCardModalProps {
  order: OrderItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onDiscardCart: () => void;
}

const ShoppingCardModal = (props: ShoppingCardModalProps) => {
  const { order } = props;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOrderSubmit = async () => {
    setIsSubmitting(true);
    try {
      const cartOrder = {
        items: order.map((item) => ({
          dish_id: item.id,
          quantity: item.quantity,
        })),
        special_instructions: order
          .map((item) =>
            item.specialInstructions
              ? `${item.name}: ${item.specialInstructions}`
              : ""
          )
          .filter(Boolean)
          .join("\n\n"),
        ticket_id: "67296617b5cb4f83a12608c3",
      };

      await uploadOrder(cartOrder);
      props.onDiscardCart();
      toast({
        title: "Orden exitosa",
        description: "Tu orden ha sido enviada correctamente",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error al ordenar",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al enviar la orden",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed top-16 right-4 w-96 dark:bg-neutral-700 shadow-md rounded-md overflow-hidden z-50">
      <div className="p-3 font-bold">Resumen Orden</div>
      <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
        {order.length === 0 ? (
          <p className="text-gray-400">Carro Vacio!</p>
        ) : (
          order.map((item, index) => (
            <div key={index} className="mb-4 text-white">
              <div className="flex justify-between items-center mb-2">
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
              <textarea
                value={item.specialInstructions || ""}
                onChange={(e) => {
                  const updatedOrder = [...order];
                  updatedOrder[index].specialInstructions = e.target.value;
                  props.onUpdateQuantity(index, item.quantity); // Trigger re-render
                }}
                placeholder="Instrucciones especiales..."
                className="w-full p-2 mt-1 text-sm text-white bg-neutral-800 rounded resize-none"
                rows={2}
              />
            </div>
          ))
        )}
        {order.length > 0 && (
          <div className="mt-4 pt-2 border-t border-gray-700">
            <div className="flex justify-between items-center text-white font-bold mb-4">
              <span>Total:</span>
              <span>
                $
                {order
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={props.onDiscardCart}
              >
                Descartar
              </Button>
              <Button
                className="flex-1"
                onClick={handleOrderSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Ordenar"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCardModal;
