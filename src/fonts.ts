const fonts = [
  new FontFace('Victor Mono', `url('${chrome.runtime.getURL('fonts/VictorMono-Medium.woff2')}'`, {
    weight: '500',
    style: 'normal',
  }),
  new FontFace(
    'Victor Mono',
    `url('${chrome.runtime.getURL('fonts/VictorMono-MediumItalic.woff2')}'`,
    {
      weight: '500',
      style: 'italic',
    },
  ),
]

export function loadFonts() {
  fonts.forEach(f =>
    f
      .load()
      .then(f => document.fonts.add(f))
      .catch(console.error),
  )
}
