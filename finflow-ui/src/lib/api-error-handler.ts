import { toast } from "sonner";

export interface ValidationErrorResponse {
  title: string;
  status: number;
  errors?: Record<string, string[]>;
}

export function parseUnknownError(err: unknown): Error {
  if (err instanceof Error)
    toast.error(err.message);

  return new Error("Unknown Exception");
}

export async function parseApiResponseError(res: Response): Promise<string> {
  const data = (await res.json()) as ValidationErrorResponse;

  if (data.errors) {
    const firstError = Object.values(data.errors)[0]?.[0];
    return firstError ?? data.title;
  }

  return data.title ?? "Unknown Exception";
}
