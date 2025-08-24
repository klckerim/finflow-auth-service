import { toast } from "sonner";

export interface ValidationErrorResponse {
  title: string;
  errorCode: string,
  status: number;
  errors?: Record<string, string[]>;
  params?: Record<string, object[]>;
}

export function parseUnknownError(err: unknown): Error {
  if (err instanceof Error)
    toast.error(err.message);

  return new Error("Unknown Exception");
}

type ParsedError = {
  errorCode: string;
  message: string;
  paramKey?: string;
  paramValue?: Record<string, any>;
};

export async function parseApiResponseError(res: Response): Promise<ParsedError> {
  const data = (await res.json()) as ValidationErrorResponse;

  let firstParamKey: string | undefined;
  let firstParamValue: Record<string, any> | undefined;

  if (data.params) {
    const entries = Object.entries(data.params);
    if (entries.length > 0) {
      [firstParamKey, firstParamValue] = entries[0]; 
    }
  }

  if (data.errors) {
    const firstError = Object.values(data.errors)[0]?.[0];
    return {
      errorCode: firstError ?? data.errorCode ?? "ValidationError",
      message: data.title,
      paramKey: firstParamKey,
      paramValue: firstParamValue,
    };
  }
  
  return {
    errorCode: data.errorCode ?? "UnknownException",
    message: data.title ?? "Unknown error",
    paramKey: firstParamKey,
    paramValue: firstParamValue,
  };
}
