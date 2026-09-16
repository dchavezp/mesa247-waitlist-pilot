export interface HostSession {
  slug: string;
  accessToken: string;
  expiresAt: string;
}

const STORAGE_KEY = "mesa247.host-session.v1";

const listeners = new Set<() => void>();

const isHostSession = (value: unknown): value is HostSession =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as HostSession).slug === "string" &&
  typeof (value as HostSession).accessToken === "string" &&
  typeof (value as HostSession).expiresAt === "string";

function readRaw(): HostSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isHostSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function getHostToken(): string | null {
  return readRaw()?.accessToken ?? null;
}

export function loadHostSession(slug: string): HostSession | null {
  const raw = readRaw();
  if (!raw || raw.slug !== slug) return null;
  if (Date.now() >= Date.parse(raw.expiresAt)) {
    clearHostSession();
    return null;
  }
  return raw;
}

export function saveHostSession(
  slug: string,
  accessToken: string,
  expiresIn: number,
): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        slug,
        accessToken,
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      }),
    );
  } catch {}
  notify();
}

export function clearHostSession(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
  notify();
}

export function subscribeHostSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
