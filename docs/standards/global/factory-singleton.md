# Factory + Singleton Pattern

Packages that manage shared state (DB, auth clients) export both:
- `create*()` factory function — for tests and re-creation
- Singleton instance — created at import time for production use

```ts
export function createDb() { return drizzle(env.DATABASE_URL, { schema }) }
export const db = createDb()
```

- Singleton is the default for production (imported by server)
- Factory is for tests that need a fresh instance
- Singleton is created at module import time, not lazily
