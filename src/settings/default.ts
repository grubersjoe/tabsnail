import type { Settings } from './settings'

// In an own module because the settings one has side effects like event handlers.
export const defaultSettings: Settings = {
  color: '#edffb8',
  shrinkPage: true,
  tabSize: 8,
  theme: 'default',
}
