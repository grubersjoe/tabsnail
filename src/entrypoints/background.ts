import {
  isActivateTabMessage,
  isCloseTabMessage,
  type Message,
  type UpdateTabsMessage,
} from '@/lib/messages'

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message: Message, _sender, response) => {
    if (isActivateTabMessage(message)) {
      void browser.tabs.update(message.tabId, { active: true }).then(response)
    }
    if (isCloseTabMessage(message)) {
      void browser.tabs.remove(message.tabId).then(response)
    }
  })

  browser.tabs.onActivated.addListener(() => {
    void sendTabs()
  })

  browser.tabs.onUpdated.addListener(() => {
    void sendTabs()
  })

  browser.tabs.onRemoved.addListener(() => {
    void sendTabs()
  })

  browser.tabs.onMoved.addListener(() => {
    void sendTabs() // (reordering tabs)
  })

  browser.tabs.onAttached.addListener(() => {
    void sendTabs() // (attaching a tab to this window)
  })

  browser.tabs.onDetached.addListener(() => {
    void sendTabs() // (detaching a tab from this window)
  })

  async function sendTabs() {
    const tabs = await browser.tabs.query({ currentWindow: true })
    const promises = []

    for (const tab of tabs) {
      if (!tab.id) {
        console.warn(`Tab #${tab.index} has no ID.`)
        continue
      }
      promises.push(
        browser.tabs.sendMessage<UpdateTabsMessage>(tab.id, {
          type: 'update-tabs',
          tabs: tabs.map(t => ({
            id: t.id,
            title: t.title,
            active: t.active,
          })),
        }),
      )
    }

    return Promise.allSettled(promises)
  }
})
