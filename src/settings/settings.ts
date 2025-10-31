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
const tabSizeValue = document.getElementById('tab-size-value') as HTMLSpanElement
const reloadButton = document.getElementById('reload') as HTMLButtonElement

chrome.storage.sync.get<Partial<Settings>>(null, settings => {
  if (settings.theme) {
    themeSelect.value = settings.theme
    colorPickerContainer.classList.toggle('d-none', settings.theme !== 'default')
  }

  if (settings.color) {
    colorPicker.value = settings.color
  }

  if (settings.tabSize) {
    tabSizeInput.value = String(settings.tabSize)
    tabSizeValue.textContent = tabSizeInput.value
  }
})

themeSelect.addEventListener('change', () => {
  const theme = themeSelect.value as Settings['theme']
  colorPickerContainer.classList.toggle('d-none', theme !== 'default')
  void chrome.storage.sync.set<Settings>({ theme })
})

colorPicker.addEventListener(
  'input',
  debounce(() => chrome.storage.sync.set<Settings>({ color: colorPicker.value }), 100),
)

tabSizeInput.addEventListener('input', () => {
  tabSizeValue.textContent = tabSizeInput.value
  debounce(() => chrome.storage.sync.set<Settings>({ tabSize: Number(tabSizeInput.value) }), 100)()
})

reloadButton.addEventListener('click', () => {
  chrome.runtime.reload()
})
