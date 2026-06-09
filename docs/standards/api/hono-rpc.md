# Hono RPC — End-to-End Type Safety

Pass types from API routes to the mobile client so compilation breaks on contract changes.

## Backend: Define Schema & Routes
```ts
const userSchema = z.object({ name: z.string().min(2), email: z.string().email() });

const routes = app.post("/users/:id", zValidator("json", userSchema), (c) => {
  return c.json({ status: "success", processedId: c.req.param("id") }, 201);
});

export type AppType = typeof routes;
```

## Frontend: Typesafe Client
```ts
import { hc } from "hono/client";
import type { AppType } from "@finn-app/server/src/index";

export const api = hc<AppType>(process.env.EXPO_PUBLIC_SERVER_URL!);
```

## Usage in Query Hook
```ts
export function useMutateUser() {
  return useMutation({
    mutationFn: async ({ id, name, email }: { id: string; name: string; email: string }) => {
      const res = await api.users[":id"].$post({ param: { id }, json: { name, email } });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["user", data.processedId] }),
  });
}
```

## Rules
- Always validate with `zValidator` at the route level
- Export `AppType` from the server entry point
- Client uses `hc<AppType>()` — never type individual endpoints manually
