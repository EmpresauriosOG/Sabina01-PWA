import { useMutation } from "@tanstack/react-query";
import { fetchChat } from "./fetchChat";

// Wire-format types — shape returned by the AI API
interface Dish {
  name: string;
  price: number;
  short_description: string;
  attributes: string[];
  id?: string;
  isActive?: number;
}

interface ChatApiResponse {
  dishes: Dish[];
  total_results: number;
  message: string;
}

// Normalized message type used throughout the chat UI
export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

/**
 * Parses raw AI API response data into normalized ChatMessage[].
 * Handles both plain-text and structured (card) bot responses.
 */
function parseResponse(data: unknown): ChatMessage[] {
  const messages: ChatMessage[] = [];

  try {
    const content = (data as Array<{ content: string }>)[0].content;

    let parsed: ChatApiResponse;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Plain string response — no structured data
      messages.push({ sender: "bot", text: content });
      return messages;
    }

    const { dishes, message } = parsed;
    if (message) messages.push({ sender: "bot", text: message });

    if (dishes?.length > 0) {
      dishes.forEach((dish) => {
        messages.push({
          sender: "bot",
          text: JSON.stringify({
            type: "card",
            content: {
              title: dish.name,
              price: dish.price,
              description: dish.short_description,
              attributes: dish.attributes,
              id: dish.id,
              isActive: dish.isActive,
            },
          }),
        });
      });
    }
  } catch (error) {
    console.error("Error parsing chat response:", error);
    messages.push({
      sender: "bot",
      text: "Error processing the server response.",
    });
  }

  return messages;
}

interface UseChatOptions {
  /** Called with the normalized messages to append after a successful response. */
  onMessages: (messages: ChatMessage[]) => void;
}

/**
 * Chat mutation hook. Handles transport + response normalization.
 * Returns `send(input)` and `isPending`.
 */
export function useChat(locationId: string, { onMessages }: UseChatOptions) {
  const mutation = useMutation({
    mutationFn: (chatInput: string) => fetchChat(locationId, chatInput),
    onSuccess: (data) => {
      const messages = parseResponse(data);
      onMessages(messages);
    },
    onError: (error) => {
      console.error("Error sending chat message:", error);
      onMessages([
        { sender: "bot", text: "Error communicating with the server." },
      ]);
    },
  });

  return {
    send: (input: string) => mutation.mutate(input),
    isPending: mutation.isPending,
  };
}
