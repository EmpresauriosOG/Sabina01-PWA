import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Order } from "@/utils/orderUtils";

interface AddCardProps {
  column: number;
  setCards: React.Dispatch<React.SetStateAction<Order[]>>;
}

const AddCard = ({ column, setCards }: AddCardProps) => {
  //ToDO: Transofrm rhis into a reusable form for adding orders!
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      column,
      restaurant_id: "default_restaurant_id", // Replace with actual restaurant ID
      location_id: "default_location_id", // Replace with actual location ID
      id: Date.now().toString(), // Generate a unique ID
      items: [
        {
          dish_id: "default_dish_id", // Replace with actual dish ID
          quantity: 1, // Default quantity, adjust as needed
        },
      ],
      total_price: 0, // Set the appropriate price
      status: 0, // Assuming 0 is the initial status
      ordered_ts: new Date().toISOString(),
      preparation_ts: null,
      serving_ts: null,
      special_instructions: text.trim(),
    };

    setCards((pv) => [...pv, newCard]);

    setAdding(false);
    setText("");
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <Plus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <Plus />
        </motion.button>
      )}
    </>
  );
};

export default AddCard;
