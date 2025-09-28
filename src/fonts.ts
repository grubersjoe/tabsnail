export function loadFonts() {
  const fonts = [
    new FontFace('Victor Mono', `url('${chrome.runtime.getURL('fonts/VictorMono-Medium.woff2')}'`, {
      weight: '500',
      style: 'normal',
    }),
  ]

  const promises = []
  for (const font of fonts) {
    promises.push(font.load().then(font => document.fonts.add(font)))
  }

  return Promise.allSettled(promises)
}
