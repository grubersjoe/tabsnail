export type Settings = {
  color: string
  shrinkViewport: boolean
  theme: 'default' | 'pride' | 'win95'
  tabSize: number
}

export const defaultSettings = {
  color: '#edffb8',
  shrinkViewport: true,
  theme: 'default',
  tabSize: 8,
} as const satisfies Settings

export const settingsStorage = {
  color: storage.defineItem<Settings['color']>('sync:color', {
    fallback: defaultSettings.color,
  }),
  shrinkViewport: storage.defineItem<Settings['shrinkViewport']>('sync:shrinkViewport', {
    fallback: defaultSettings.shrinkViewport,
  }),
  tabSize: storage.defineItem<Settings['tabSize']>('sync:tabSize', {
    fallback: defaultSettings.tabSize,
  }),
  theme: storage.defineItem<Settings['theme']>('sync:theme', {
    fallback: defaultSettings.theme,
  }),
}

export async function getSettings() {
  const snapshot = await storage.snapshot('sync')
  return Object.assign({}, defaultSettings, snapshot) as Settings
}
