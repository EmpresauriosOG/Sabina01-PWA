import { Order, updateOrder } from "@/utils/orderUtils";
import { Flame, Trash2 } from "lucide-react";
import { useState } from "react";

interface BurnBarrelProps {
  setCards: React.Dispatch<React.SetStateAction<Order[]>>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const BurnBarrel = ({ setCards }: BurnBarrelProps) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = async (e: any) => {
    const cardId = e.dataTransfer.getData("cardId");
    if (!cardId) {
      console.error("No card ID found in drag event");
      return;
    }
    try {
      await updateOrder(cardId, 5); // Assuming column 5 is the "burned" column
      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error("Failed to update order status:", error);
      // Handle error (e.g., show a notification to the user)
    }
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <Flame className="animate-bounce" /> : <Trash2 />}
    </div>
  );
};

export default BurnBarrel;
