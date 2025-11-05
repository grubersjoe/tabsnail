import './settings.scss'
import { debounce } from '@/lib'
import { getStateSnapshot, type State, stateStorage } from '@/lib/state'

const shrinkViewportInput = document.getElementById('shrink-viewport') as HTMLInputElement
const themeSelect = document.getElementById('theme') as HTMLSelectElement
const colorPicker = document.getElementById('color-picker') as HTMLInputElement
const colorPickerContainer = document.getElementById('color-picker-container') as HTMLInputElement
const tabSizeInput = document.getElementById('tab-size') as HTMLInputElement
const tabSizeValue = document.getElementById('tab-size-value') as HTMLSpanElement

const state = await getStateSnapshot()

shrinkViewportInput.checked = state.shrinkViewport
themeSelect.value = state.theme

colorPicker.value = state.color
colorPickerContainer.classList.toggle('d-none', themeSelect.value !== 'default')

tabSizeInput.value = String(state.tabSize)
tabSizeValue.textContent = tabSizeInput.value

shrinkViewportInput.addEventListener('input', () => {
  debounce(() => void stateStorage.shrinkViewport.setValue(shrinkViewportInput.checked), 100)()
})

themeSelect.addEventListener('change', () => {
  const theme = themeSelect.value as State['theme']
  colorPickerContainer.classList.toggle('d-none', theme !== 'default')
  void stateStorage.theme.setValue(theme)
})

colorPicker.addEventListener(
  'input',
  debounce(() => stateStorage.color.setValue(colorPicker.value), 100),
)

tabSizeInput.addEventListener('input', () => {
  tabSizeValue.textContent = tabSizeInput.value
  debounce(() => void stateStorage.tabSize.setValue(Number(tabSizeInput.value)), 100)()
})
