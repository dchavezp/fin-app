import { useSyncExternalStore } from "react";

import { authClient } from "@/lib/auth-client";
import { getMock, subscribe } from "@/lib/mock-auth";

export function useSession() {
  const mock = useSyncExternalStore(subscribe, getMock);
  const { data, isPending, error } = authClient.useSession();

  if (__DEV__ && mock) {
    return {
      data: mock,
      isPending: false,
      error: null,
    };
  }

  return { data, isPending, error };
}
