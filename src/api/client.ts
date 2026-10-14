import { DivacastClient } from './divacast-api'

/**
 * Firebase ID token provider. It defaults to signed-out so the store is usable
 * before auth is wired up; only /v1/healthz will succeed until you configure:
 *
 *     import { getAuth } from 'firebase/auth'
 *     setIdTokenGetter(() => getAuth().currentUser?.getIdToken() ?? null)
 *
 * The Firebase SDK refreshes tokens close to expiry, so call it per request
 * rather than caching the string.
 */
let idTokenGetter: () => Promise<string | null> = async () => null

export function setIdTokenGetter(getter: () => Promise<string | null>): void {
  idTokenGetter = getter
}

export const divacast = new DivacastClient({
  getIdToken: () => idTokenGetter(),
})
