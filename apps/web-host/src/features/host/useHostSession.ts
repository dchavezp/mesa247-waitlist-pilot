import { useEffect, useState } from "react";
import {
  loadHostSession,
  subscribeHostSession,
  type HostSession,
} from "./hostSession";

export function useHostSession(slug: string): HostSession | null {
  const [session, setSession] = useState(() => loadHostSession(slug));

  useEffect(
    () => subscribeHostSession(() => setSession(loadHostSession(slug))),
    [slug],
  );

  return session;
}
