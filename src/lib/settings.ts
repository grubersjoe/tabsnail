import { type ThemeKey, isThemeKey } from '@/lib/themes'

export type Settings = {
  color: string
  shrinkViewport: boolean
  showHead: boolean
  theme: ThemeKey
  tabSize: number
}

export const defaultSettings: Settings = {
  color: '#351e9e',
  shrinkViewport: true,
  showHead: true,
  theme: 'default',
  tabSize: 8,
}

export const settingsStorage = {
  color: storage.defineItem<Settings['color']>('sync:color', {
    fallback: defaultSettings.color,
  }),

  shrinkViewport: storage.defineItem<Settings['shrinkViewport']>('sync:shrinkViewport', {
    fallback: defaultSettings.shrinkViewport,
  }),

  showHead: storage.defineItem<Settings['showHead']>('sync:showHead', {
    fallback: defaultSettings.showHead,
  }),

  tabSize: storage.defineItem<Settings['tabSize']>('sync:tabSize', {
    fallback: defaultSettings.tabSize,
  }),

  theme: storage.defineItem<Settings['theme']>('sync:theme', {
    fallback: defaultSettings.theme,
  }),
}

export async function getSettingsSnapshot() {
  const snapshot = await storage.snapshot('sync')
  const settings = Object.assign({}, defaultSettings, snapshot) as Settings

  // A theme key may be removed later but still exist in the storage.
  if (!isThemeKey(settings.theme)) {
    settings.theme = defaultSettings.theme
  }

  return settings
}
