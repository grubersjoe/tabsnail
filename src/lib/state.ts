import type { Theme } from '@/lib/themes'

export type State = {
  color: string
  shrinkViewport: boolean
  theme: Theme
  tabSize: number
}

export const defaultState = {
  color: '#edffb8',
  shrinkViewport: true,
  theme: 'default',
  tabSize: 8,
} as const satisfies State

export const stateStorage = {
  color: storage.defineItem<State['color']>('sync:color', {
    fallback: defaultState.color,
  }),
  shrinkViewport: storage.defineItem<State['shrinkViewport']>('sync:shrinkViewport', {
    fallback: defaultState.shrinkViewport,
  }),
  tabSize: storage.defineItem<State['tabSize']>('sync:tabSize', {
    fallback: defaultState.tabSize,
  }),
  theme: storage.defineItem<State['theme']>('sync:theme', {
    fallback: defaultState.theme,
  }),
}

export async function getStateSnapshot() {
  const snapshot = await storage.snapshot('sync')
  return Object.assign({}, defaultState, snapshot) as State
}
