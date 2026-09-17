import { useEffect, useRef } from 'react'

/** Module-level dedupe across route changes / component unmounts. */
const notifiedIds = new Set<string>()

export function useCallNotification(id: string, status?: string) {
  const prevStatus = useRef<string | undefined>(status)

  useEffect(() => {
    const before = prevStatus.current
    prevStatus.current = status
    if (!status || before === status) return
    if (status !== 'NOTIFIED') return
    if (notifiedIds.has(id)) return
    if (!('Notification' in window) || Notification.permission !== 'granted') return
    notifiedIds.add(id)
    try {
      new Notification('¡Tu mesa está lista!', {
        body: 'Acércate a recepción y te ubicamos en tu mesa.',
        tag: `mesa247-${id}`,
      })
    } catch {
      notifiedIds.delete(id)
    }
  }, [id, status])
}

export function requestNotificationPermission(): void {
  if (!('Notification' in window)) return
  if (Notification.permission === 'default') void Notification.requestPermission()
}