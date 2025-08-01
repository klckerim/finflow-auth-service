
import { useEffect, useState } from "react";
import { getMe } from "@/lib/auth";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, isLoading };
}
