import { useEffect, useState, useCallback, useRef } from "react";
import OrderColumn from "@/components/orders/OrderColumn";
import BurnBarrel from "@/components/orders/BurnBarrel";
import { useUserStore } from "@/shared/state/userState";
import { Order } from "@/utils/orderUtils";
import { isWsPingMessage, parseWsOrderMessage } from "@/shared/contracts/api";

export interface Card {
  _id: string;
  title: string;
  column: string;
}

// TODO [C4/BR-007]: Max reconnect delay and backoff multiplier may need tuning
// once BR-007 confirms reconnect/backfill expectations from the backend.
const WS_RECONNECT_BASE_MS = 1000;
const WS_RECONNECT_MAX_MS = 30000;

const OrderBoard = ({ data }: { data: Order[] }) => {
  const { user } = useUserStore();
  const [cards, setCards] = useState<Order[]>(data);
  const [wsError, setWsError] = useState(false);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountedRef = useRef(false);

  const updateCards = useCallback((newCard: Order) => {
    if (!newCard || !newCard._id) {
      console.error("Invalid card data:", newCard);
      return;
    }

    setCards((prevCards) => {
      const existingCardIndex = prevCards.findIndex(
        (card) => card._id === newCard._id
      );
      if (existingCardIndex !== -1) {
        return prevCards.map((card, index) =>
          index === existingCardIndex ? { ...card, ...newCard } : card
        );
      } else {
        return [...prevCards, newCard];
      }
    });
  }, []);

  useEffect(() => {
    unmountedRef.current = false;

    const connect = () => {
      if (unmountedRef.current || !user?.restaurant_id || !user?.location_id) return;

      const ws = new WebSocket(
        // TODO [C4/BR-017]: Auth token requirement for ws connection not yet confirmed.
        `wss://sabina01.onrender.com/ws/orders/${user.restaurant_id}/${user.location_id}`
      );

      ws.onopen = () => {
        reconnectAttemptRef.current = 0;
        setWsError(false);
      };

      ws.onmessage = (event) => {
        const message = parseWsOrderMessage<Order>(event.data);
        if (!message || isWsPingMessage(message)) return;
        updateCards(message.order);
      };

      ws.onerror = () => {
        setWsError(true);
      };

      ws.onclose = () => {
        if (unmountedRef.current) return;
        const delay = Math.min(
          WS_RECONNECT_BASE_MS * 2 ** reconnectAttemptRef.current,
          WS_RECONNECT_MAX_MS
        );
        reconnectAttemptRef.current += 1;
        reconnectTimerRef.current = setTimeout(connect, delay);
      };

      return ws;
    };

    const ws = connect();

    return () => {
      unmountedRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      ws?.close();
    };
  }, [user?.restaurant_id, user?.location_id, updateCards]);

  const filteredCards = useCallback(
    (column: number) => {
      return cards.filter((card) => card.status === column);
    },
    [cards]
  );

  return (
    <div className="flex flex-col h-full w-full">
      {wsError && (
        <div className="px-4 py-2 text-sm text-yellow-800 bg-yellow-100 border-b border-yellow-200">
          Reconectando al servidor de pedidos...
        </div>
      )}
    <div className="flex flex-col md:flex-row h-full w-full gap-3 overflow-x-auto p-4 md:p-12">
      <OrderColumn
        title="Pedidos"
        column={1}
        key={1}
        headingColor="text-orange-100"
        cards={filteredCards(1)}
        allCards={cards}
        setCards={setCards}
      />
      <OrderColumn
        title="Confirmados"
        column={2}
        key={2}
        headingColor="text-orange-200"
        cards={filteredCards(2)}
        allCards={cards}
        setCards={setCards}
      />
      <OrderColumn
        title="Cocinando..."
        column={3}
        key={3}
        headingColor="text-orange-300"
        cards={filteredCards(3)}
        allCards={cards}
        setCards={setCards}
      />
      <OrderColumn
        title="Listo"
        column={4}
        headingColor="text-orange-500"
        cards={filteredCards(4)}
        allCards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
    </div>
  );
};

export default OrderBoard;
