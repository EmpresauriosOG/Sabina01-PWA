import { useEffect, useState, useCallback } from "react";
import OrderColumn from "@/components/orders/OrderColumn";
import BurnBarrel from "@/components/orders/BurnBarrel";
import { useUserStore } from "@/shared/state/userState";
import { Order } from "@/utils/orderUtils";

export interface Card {
  id: string;
  title: string;
  column: string;
}

const OrderBoard = ({ data }: { data: Order[] }) => {
  const { user } = useUserStore();
  const [cards, setCards] = useState<Order[]>(data);

  const updateCards = useCallback((newCard: Order) => {
    if (!newCard || !newCard.id) {
      console.error("Invalid card data:", newCard);
      return;
    }

    setCards((prevCards) => {
      const existingCardIndex = prevCards.findIndex(
        (card) => card.id === newCard.id
      );
      if (existingCardIndex !== -1) {
        // Update existing card
        return prevCards.map((card, index) =>
          index === existingCardIndex ? { ...card, ...newCard } : card
        );
      } else {
        // Add new card
        return [...prevCards, newCard];
      }
    });
  }, []);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://sabina01.onrender.com/ws/orders/${user?.restaurant_id}/${user?.location_id}`
    );

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      const newCard: Order = JSON.parse(event.data).order;
      updateCards(newCard);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [user?.restaurant_id, user?.location_id, updateCards]);

  const filteredCards = useCallback(
    (column: number) => {
      return cards.filter((card) => card.status === column);
    },
    [cards]
  );

  return (
    //ToDO: Check this container. map Order COlumns
    <div className="flex flex-col md:flex-row h-full w-full gap-3 overflow-x-auto p-4 md:p-12">
      <OrderColumn
        title="Pedidos"
        column={1}
        key={1}
        headingColor="text-neutral-500"
        cards={filteredCards(1)}
        allCards={cards}
        setCards={setCards}
      />
      <OrderColumn
        title="Confirmados"
        column={2}
        key={2}
        headingColor="text-yellow-200"
        cards={filteredCards(2)}
        allCards={cards}
        setCards={setCards}
      />
      <OrderColumn
        title="Cocinando..."
        column={3}
        key={3}
        headingColor="text-blue-200"
        cards={filteredCards(3)}
        allCards={cards}
        setCards={setCards}
      />
      <OrderColumn
        title="Listo"
        column={4}
        headingColor="text-emerald-200"
        cards={filteredCards(4)}
        allCards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

export default OrderBoard;
