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

chrome.storage.sync.get<Settings>(['theme', 'color', 'tabSize'], ({ theme, color, tabSize }) => {
  if (theme) {
    themeSelect.value = theme
  }

  if (color) {
    colorPicker.value = color
  }

  if (tabSize) {
    tabSizeInput.value = tabSize.toString()
  }
})

themeSelect.addEventListener('change', () => {
  const theme = themeSelect.value as Settings['theme']
  colorPickerContainer.style.display = theme === 'default' ? 'flex' : 'none'
  return chrome.storage.sync.set<Settings>({ theme })
})

colorPicker.addEventListener(
  'input',
  debounce(() => chrome.storage.sync.set<Settings>({ color: colorPicker.value }), 100),
)

tabSizeInput.addEventListener('input', () =>
  chrome.storage.sync.set<Settings>({ tabSize: Number(tabSizeInput.value) }),
)

reloadButton.addEventListener('click', async () => {
  chrome.runtime.reload()
})
