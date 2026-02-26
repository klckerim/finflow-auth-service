const FALLBACK_RANDOM_LENGTH = 32;

const getRandomHex = (length: number): string => {
  const cryptoApi = globalThis.crypto;

  if (cryptoApi?.getRandomValues) {
    const bytes = new Uint8Array(Math.ceil(length / 2));
    cryptoApi.getRandomValues(bytes);

    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, length);
  }

  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join("");
};

export const generateIdempotencyKey = (): string => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${getRandomHex(FALLBACK_RANDOM_LENGTH)}`;
};
