import { useEffect, useRef, useState } from 'react'
import type { ActorId } from './types'

export interface ServerState {
  code: string
  revision: number
  stage: 'lobby' | 'briefing' | 'tension' | 'decide' | 'reveal' | 'endstate'
  phaseIdx: number
  seed: number
  roles: Record<ActorId, boolean>
  you: ActorId | null
  isHost: boolean
  submitted: Record<string, boolean>
  submissions: Record<number, Partial<Record<ActorId, string>>>
}

export interface Session {
  code: string
  token: string
}

const SESSION_KEY = 'f2033_workshop_session'

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function saveSession(s: Session | null) {
  if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s))
  else localStorage.removeItem(SESSION_KEY)
}

async function api<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`)
  return data as T
}

export const createGame = () => api<{ code: string; token: string; seed: number }>('/games', {})
export const joinGame = (code: string, actor: ActorId, token?: string) =>
  api<{ token: string; state: ServerState }>(`/games/${code}/join`, { actor, token })
export const getState = (code: string, token: string) =>
  api<ServerState>(`/games/${code}/state?token=${encodeURIComponent(token)}`)
export const submitMove = (code: string, token: string, actionId: string) =>
  api<{ state: ServerState }>(`/games/${code}/submit`, { token, actionId })
export const advanceGame = (code: string, token: string) =>
  api<{ state: ServerState }>(`/games/${code}/advance`, { token })

/** Poll the server state every 2s (the wargame-multiplayer cadence). */
export function useServerState(session: Session | null) {
  const [state, setState] = useState<ServerState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const stateRef = useRef<ServerState | null>(null)

  useEffect(() => {
    if (!session) return
    let live = true
    const tick = async () => {
      try {
        const s = await getState(session.code, session.token)
        if (!live) return
        if (!stateRef.current || s.revision !== stateRef.current.revision) {
          stateRef.current = s
          setState(s)
        }
        setError(null)
      } catch (e) {
        if (live) setError(e instanceof Error ? e.message : String(e))
      }
    }
    tick()
    const id = setInterval(tick, 2000)
    return () => {
      live = false
      clearInterval(id)
    }
  }, [session])

  const push = (s: ServerState) => {
    stateRef.current = s
    setState(s)
  }
  return { state, error, push }
}
