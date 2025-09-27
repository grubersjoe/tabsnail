import type { Settings } from './background.ts'

const colorPicker = document.getElementById('color-picker') as HTMLInputElement
const tabSizeInput = document.getElementById('tab-size') as HTMLInputElement
const reloadButton = document.getElementById('reload') as HTMLButtonElement

chrome.storage.sync.get<Settings>(['color', 'tabSize'], ({ color, tabSize }) => {
  if (color) {
    colorPicker.value = color
  }

  if (tabSize) {
    tabSizeInput.value = tabSize.toString()
  }
})

colorPicker.addEventListener(
  'input',
  debounce(() => chrome.storage.sync.set({ color: colorPicker.value }), 100),
)

tabSizeInput.addEventListener(
  'input',
  debounce(() => chrome.storage.sync.set({ tabSize: Number(tabSizeInput.value) }), 100),
)

reloadButton.addEventListener('click', async () => {
  chrome.runtime.reload()
})

function debounce(callback: (...args: unknown[]) => unknown, wait: number) {
  let timeoutId: number | undefined
  return (...args: unknown[]) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args)
    }, wait)
  }
}
