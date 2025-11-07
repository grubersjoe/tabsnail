import './settings.scss'
import { debounce } from '@/lib'
import { type Settings, getSettingsSnapshot, settingsStorage } from '@/lib/settings'

const shrinkViewportInput = document.getElementById('shrink-viewport') as HTMLInputElement
const themeSelect = document.getElementById('theme') as HTMLSelectElement
const colorPicker = document.getElementById('color-picker') as HTMLInputElement
const colorPickerContainer = document.getElementById('color-picker-container') as HTMLInputElement
const tabSizeInput = document.getElementById('tab-size') as HTMLInputElement
const tabSizeValue = document.getElementById('tab-size-value') as HTMLSpanElement

const settings = await getSettingsSnapshot()

shrinkViewportInput.checked = settings.shrinkViewport
themeSelect.value = settings.theme

colorPicker.value = settings.color
colorPickerContainer.classList.toggle('d-none', themeSelect.value !== 'default')

tabSizeInput.value = String(settings.tabSize)
tabSizeValue.textContent = tabSizeInput.value

shrinkViewportInput.addEventListener('input', () => {
  debounce(() => void settingsStorage.shrinkViewport.setValue(shrinkViewportInput.checked), 100)()
})

themeSelect.addEventListener('change', () => {
  const theme = themeSelect.value as Settings['theme']
  colorPickerContainer.classList.toggle('d-none', theme !== 'default')
  void settingsStorage.theme.setValue(theme)
})

colorPicker.addEventListener(
  'input',
  debounce(() => settingsStorage.color.setValue(colorPicker.value), 100),
)

tabSizeInput.addEventListener('input', () => {
  tabSizeValue.textContent = tabSizeInput.value
  debounce(() => void settingsStorage.tabSize.setValue(Number(tabSizeInput.value)), 100)()
})
