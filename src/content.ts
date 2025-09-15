import type { TabListMessage } from './background.ts'

function isTabListMessage(msg: { type: string }): msg is TabListMessage {
  return msg.type === 'tabList'
}

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (isTabListMessage(msg)) {
    const id = 'schnecke'
    let elem = document.getElementById(id)

    if (!elem) {
      elem = document.createElement('div')
      elem.id = id
      elem.style.cssText = `--grid-columns: ${msg.gridDimensions[0]}; --grid-rows: ${msg.gridDimensions[1]};`

      document.documentElement.appendChild(elem)
    }

    console.log('msg', msg.tabs)

    elem.innerHTML = msg.tabs
      .map((tab, index) => {
        const [x, y] = tab.gridPosition

        return `
          <div style="grid-row: ${x + 1}; grid-column: ${y + 1}; background-color: lch(from cornflowerblue calc(l + ${index + 3}) c h); ">
            <span>${tab.title}</span>
          </div>
         `
      })
      .join('')
  }

  sendResponse()
})
