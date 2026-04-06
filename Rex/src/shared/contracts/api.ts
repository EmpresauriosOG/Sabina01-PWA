import axios from "axios";

type UnknownRecord = Record<string, unknown>;

export type ApiEnvelope<TData, TMeta = unknown> = {
  success: boolean;
  data: TData;
  message: string | null;
  errors: unknown;
  meta: TMeta | null;
};

export type PaginationMeta = {
  total: number;
  skip: number;
  limit: number;
};

export type ApiErrorEnvelope = {
  success: false;
  message: string;
  errors?: unknown;
  meta?: unknown | null;
};

export type WsPingMessage = {
  type: "ping";
};

export type WsOrderUpdateMessage<TOrder> = {
  type?: "order_update" | "order" | string;
  order: TOrder;
};

export type WsOrderMessage<TOrder> = WsPingMessage | WsOrderUpdateMessage<TOrder>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

export function isApiEnvelope<TData = unknown, TMeta = unknown>(
  value: unknown
): value is ApiEnvelope<TData, TMeta> {
  return (
    isRecord(value) &&
    typeof value.success === "boolean" &&
    "data" in value &&
    "message" in value &&
    "errors" in value &&
    "meta" in value
  );
}

export function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  return (
    isRecord(value) && value.success === false && typeof value.message === "string"
  );
}

export function unwrapApiEnvelope<TPayload>(payload: unknown): TPayload {
  if (isApiEnvelope<TPayload>(payload)) {
    return payload.data;
  }

  return payload as TPayload;
}

export function resolveArrayPayload<TItem>(
  payload: unknown,
  keys: readonly string[] = []
): TItem[] {
  const unwrapped = unwrapApiEnvelope<unknown>(payload);

  if (Array.isArray(unwrapped)) {
    return unwrapped as TItem[];
  }

  if (isRecord(unwrapped)) {
    for (const key of keys) {
      const value = unwrapped[key];
      if (Array.isArray(value)) {
        return value as TItem[];
      }
    }
  }

  if (isRecord(payload)) {
    for (const key of keys) {
      const value = payload[key];
      if (Array.isArray(value)) {
        return value as TItem[];
      }
    }
  }

  return [];
}

export function resolveObjectPayload<TObject extends object>(
  payload: unknown,
  keys: readonly string[] = []
): TObject | null {
  const unwrapped = unwrapApiEnvelope<unknown>(payload);

  if (isRecord(unwrapped)) {
    for (const key of keys) {
      const value = unwrapped[key];
      if (isRecord(value)) {
        return value as TObject;
      }
    }

    return unwrapped as TObject;
  }

  if (isRecord(payload)) {
    for (const key of keys) {
      const value = payload[key];
      if (isRecord(value)) {
        return value as TObject;
      }
    }
  }

  return null;
}

export function resolvePaginationMeta(payload: unknown): PaginationMeta | null {
  if (!isApiEnvelope<unknown, unknown>(payload)) {
    return null;
  }

  const meta = payload.meta;
  if (!isRecord(meta)) {
    return null;
  }

  const total = Number(meta.total);
  const skip = Number(meta.skip);
  const limit = Number(meta.limit);

  if (!Number.isFinite(total) || !Number.isFinite(skip) || !Number.isFinite(limit)) {
    return null;
  }

  return { total, skip, limit };
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (isApiErrorEnvelope(error.response?.data)) {
      return error.response.data.message;
    }

    if (isRecord(error.response?.data) && typeof error.response.data.message === "string") {
      return error.response.data.message;
    }

    if (typeof error.message === "string" && error.message.length > 0) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return fallback;
}

export function isWsPingMessage(value: unknown): value is WsPingMessage {
  return (
    isRecord(value) &&
    "type" in value &&
    typeof value.type === "string" &&
    value.type === "ping"
  );
}

export function isWsOrderUpdateMessage<TOrder>(
  value: unknown
): value is WsOrderUpdateMessage<TOrder> {
  return isRecord(value) && "order" in value;
}

export function parseWsOrderMessage<TOrder>(
  raw: unknown
): WsOrderMessage<TOrder> | null {
  let parsed: unknown = raw;

  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  if (isWsPingMessage(parsed)) {
    return parsed;
  }

  if (isWsOrderUpdateMessage<TOrder>(parsed)) {
    return parsed;
  }

  return null;
}
