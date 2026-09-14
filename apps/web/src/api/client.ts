// BACKEND CORS allows http://localhost:5173; no Vite proxy because API routes
// are unprefixed (no /api base), so the frontend talks to the API origin directly.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  readonly status: number
  readonly detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const hasBody = init.body !== undefined
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      // Keep GETs preflight-free: a JSON content type on a bodyless request
      // would force a CORS OPTIONS round-trip on every 5 s poll.
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  })

  if (!response.ok) {
    let detail = `HTTP ${response.status}`
    try {
      // FastAPI error bodies carry a Spanish `detail` (e.g. "Turno no encontrado").
      const body = (await response.json()) as { detail?: string }
      if (body.detail) detail = body.detail
    } catch {
      // Non-JSON error body; keep the numeric fallback.
    }
    throw new ApiError(response.status, detail)
  }

  return (await response.json()) as T
}