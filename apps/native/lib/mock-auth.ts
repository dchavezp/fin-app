type MockUser = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
};

type MockSession = {
  user: MockUser;
  session: { id: string };
};

let currentMock: MockSession | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const fn of listeners) {
    fn();
  }
}

function getMock(): MockSession | null {
  return currentMock;
}

function setMock(session: MockSession | null) {
  currentMock = session;
  notify();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

const mockUser: MockUser = {
  id: "mock-user-1",
  email: "demo@finapp.dev",
  name: "Demo User",
};

export function enableMockAuth() {
  setMock({ user: mockUser, session: { id: "mock-session-1" } });
}

export function disableMockAuth() {
  setMock(null);
}

export function isMockAuthEnabled() {
  return currentMock !== null;
}

export { getMock, setMock, subscribe };
