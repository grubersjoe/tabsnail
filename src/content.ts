import type { TabListMessage } from './background.ts'

function isTabListMessage(msg: { type: string }): msg is TabListMessage {
  return msg.type === 'tabList'
}

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (isTabListMessage(msg)) {
    const id = 'schnecke'
    let elem = document.getElementById(id)

    if (!elem) {
      elem = document.createElement('ul')
      elem.id = id
      document.documentElement.appendChild(elem)
    }

    elem.innerHTML = msg.tabs.map(t => `<li>${t.title}</li>`).join('')
  }

  sendResponse()
})
