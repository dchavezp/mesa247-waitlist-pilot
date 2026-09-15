export interface SavedTicket {
  id: string;
  createdAt: string;
}

export const TICKET_TTL_MS = 12 * 60 * 60 * 1000;

const STORAGE_KEY = "mesa247.tickets.v1";

const isSavedTicket = (value: unknown): value is SavedTicket =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as SavedTicket).id === "string" &&
  typeof (value as SavedTicket).createdAt === "string";

function readRaw(): SavedTicket[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isSavedTicket) : [];
  } catch {
    return [];
  }
}

function writeRaw(tickets: SavedTicket[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch {
    // Igual que arriba: falla en silencio, nunca rompe el flujo.
  }
}

/** Turnos guardados sin expirar, más recientes primero. */
export function loadSavedTickets(): SavedTicket[] {
  const raw = readRaw();
  const now = Date.now();
  const fresh = raw.filter(
    (ticket) => now - Date.parse(ticket.createdAt) < TICKET_TTL_MS,
  );
  if (fresh.length !== raw.length) writeRaw(fresh);
  return [...fresh].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}

export function saveSavedTicket(id: string): void {
  const tickets = readRaw();
  if (tickets.some((ticket) => ticket.id === id)) return;
  writeRaw([...tickets, { id, createdAt: new Date().toISOString() }]);
}

export function removeSavedTicket(id: string): void {
  writeRaw(readRaw().filter((ticket) => ticket.id !== id));
}
