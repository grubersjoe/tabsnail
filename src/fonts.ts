const fonts = [
  new FontFace('Victor Mono', `url('${chrome.runtime.getURL('fonts/VictorMono-Medium.woff2')}'`, {
    weight: '500',
    style: 'normal',
  }),
]

export function loadFonts() {
  fonts.forEach(font =>
    font
      .load()
      .then(f => document.fonts.add(f))
      .catch(console.error),
  )
}
