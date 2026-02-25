export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type FinflowSession = {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
};

export type RequestOptions = {
  method?: HttpMethod;
  token?: string;
  body?: unknown;
  idempotencyKey?: string;
  headers?: Record<string, string>;
  rawBody?: string;
};

export async function requestApi<T>(baseUrl: string, path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.rawBody ? {} : { "Content-Type": "application/json" }),
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...(options.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : {}),
    ...(options.headers ?? {})
  };

  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers,
    credentials: "include",
    body: options.rawBody ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined)
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(typeof payload === "string" ? payload : payload?.message ?? "Request failed");
  }

  return payload as T;
}

export function defaultApiBase() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5246";
}

export function toCurrency(value: number, currency = "EUR") {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency }).format(value);
}

export function shortDate(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}
