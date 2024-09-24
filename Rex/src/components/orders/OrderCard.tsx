/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import DropIndicator from "./DropIndicator";
import { Order, updateOrder } from "@/utils/orderUtils";

interface OrderCardProps {
  order: Order;
  column: number;
  handleDragStart: (e: any, card: Order) => void;
}

const OrderCard = ({ order, column, handleDragStart }: OrderCardProps) => {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  useEffect(() => {
    if (!order.id) {
      console.error("Order ID is undefined", order);
      return;
    }

    let isMounted = true;
    const updateOrderStatus = async () => {
      try {
        await updateOrder(order.id, column);
      } catch (error) {
        if (isMounted) {
          console.error("Failed to update order status:", error);
          // Handle error (e.g., show a notification to the user)
        }
      }
    };
    updateOrderStatus();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.id, column]);

  if (!order.id) {
    return null; // or return a placeholder component
  }

  return (
    <>
      <DropIndicator beforeId={order.id} column={column} />
      <motion.div
        layout
        layoutId={order.id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { ...order })}
        className="cursor-grab active:cursor-grabbing mb-2"
      >
        <Card className="w-full">
          <CardContent className="p-3">
            {order.items.map((dish, index) => (
              <p key={index} className="text-sm">
                {dish.dish_name} x{dish.quantity}
              </p>
            ))}
            {order.special_instructions && (
              <Collapsible
                open={isInstructionsOpen}
                onOpenChange={setIsInstructionsOpen}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs md:text-sm"
                  >
                    {isInstructionsOpen ? "Hide" : "Show"} Special Instructions
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <p className="text-xs md:text-sm">
                    {order.special_instructions}
                  </p>
                </CollapsibleContent>
              </Collapsible>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default OrderCard;
