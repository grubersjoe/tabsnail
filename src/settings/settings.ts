import { debounce } from '../lib'

export type Settings = {
  color: string
  theme: 'default' | 'pride' | 'win95'
  tabSize: number
}

const themeSelect = document.getElementById('theme') as HTMLSelectElement
const colorPicker = document.getElementById('color-picker') as HTMLInputElement
const colorPickerContainer = document.getElementById('color-picker-container') as HTMLInputElement
const tabSizeInput = document.getElementById('tab-size') as HTMLInputElement
const reloadButton = document.getElementById('reload') as HTMLButtonElement

chrome.storage.sync.get<Partial<Settings>>(null, settings => {
  if (settings.theme) {
    themeSelect.value = settings.theme
    colorPickerContainer.style.display = settings.theme === 'default' ? 'flex' : 'none'
  }

  if (settings.color) {
    colorPicker.value = settings.color
  }

  if (settings.tabSize) {
    tabSizeInput.value = String(settings.tabSize)
  }
})

themeSelect.addEventListener('change', () => {
  const theme = themeSelect.value as Settings['theme']
  colorPickerContainer.style.display = theme === 'default' ? 'flex' : 'none'
  void chrome.storage.sync.set<Settings>({ theme })
})

colorPicker.addEventListener(
  'input',
  debounce(() => chrome.storage.sync.set<Settings>({ color: colorPicker.value }), 100),
)

tabSizeInput.addEventListener('input', () => {
  void chrome.storage.sync.set<Settings>({ tabSize: Number(tabSizeInput.value) })
})

reloadButton.addEventListener('click', () => {
  chrome.runtime.reload()
})
