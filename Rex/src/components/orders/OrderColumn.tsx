/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
//Components
import DropIndicator from "./DropIndicator";
import OrderCard from "./OrderCard";

//Types
import { Order } from "@/utils/orderUtils";

interface OrderColumnProps {
  title: string;
  headingColor: string;
  cards: Order[];
  column: number;
  allCards: Order[];
  setCards: React.Dispatch<React.SetStateAction<Order[]>>;
}

const OrderColumn = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
}: OrderColumnProps) => {
  //This just changes styles when dragging
  const [active, setActive] = useState(false);
  const handleDragStart = (e: any, card: Order) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: any) => {
    const cardId = e.dataTransfer.getData("cardId");
    if (!cardId) {
      console.error("No card ID found in drag event");
      return;
    }
    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    setCards((prevCards) => {
      const cardIndex = prevCards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) {
        console.error("Card not found:", cardId);
        return prevCards;
      }

      const newCards = [...prevCards];
      const [movedCard] = newCards.splice(cardIndex, 1);
      const updatedCard = { ...movedCard, status: column };

      if (before === "-1") {
        newCards.push(updatedCard);
      } else {
        const insertIndex = newCards.findIndex((c) => c.id === before);
        if (insertIndex === -1) {
          newCards.push(updatedCard);
        } else {
          newCards.splice(insertIndex, 0, updatedCard);
        }
      }
      return newCards;
    });
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els: any = null) => {
    const indicators = els || getIndicators();

    indicators.forEach((i: any) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: any) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: any, indicators: any) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest: any, child: any) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {cards.filter((card) => card.status === column).length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {cards.map((c) => {
          return (
            <OrderCard
              key={c.id}
              order={c}
              column={column}
              handleDragStart={handleDragStart}
            />
          );
        })}
        <DropIndicator beforeId={null} column={column} />
        {/* <AddCard column={column} setCards={setCards} /> */}
      </div>
    </div>
  );
};

export default OrderColumn;
