const picker = document.getElementById('color-picker') as HTMLInputElement

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

function debounce(callback: () => unknown, wait: number) {
  let timeoutId: number | undefined
  return (...args: []) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      console.log('apply')
      callback.apply(null, args)
    }, wait)
  }
}
