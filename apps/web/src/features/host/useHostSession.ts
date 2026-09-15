import { useEffect, useState } from 'react'
import { loadHostSession, subscribeHostSession, type HostSession } from './hostSession'

/** Sesión reactiva del anfitrión: se actualiza al guardar/limpiar (login, 401, expiración). */
export function useHostSession(slug: string): HostSession | null {
  const [session, setSession] = useState(() => loadHostSession(slug))

  useEffect(() => subscribeHostSession(() => setSession(loadHostSession(slug))), [slug])

  return session
}