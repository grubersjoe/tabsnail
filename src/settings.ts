const picker = document.getElementById('color-picker') as HTMLInputElement
const reloadButton = document.getElementById('reload') as HTMLButtonElement

chrome.storage.sync.get('color', ({ color }) => {
  if (color) {
    picker.value = color
  }
})

picker.addEventListener(
  'input',
  debounce(() => {
    chrome.storage.sync.set({ color: picker.value })
  }, 200),
)

reloadButton.addEventListener('click', async () => {
  chrome.runtime.reload()
  await chrome.tabs.reload()
})

function debounce(callback: (...args: unknown[]) => unknown, wait: number) {
  let timeoutId: number | undefined
  return (...args: unknown[]) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      console.log('apply')
      callback.apply(null, args)
    }, wait)
  }
}
