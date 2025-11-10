import {
  type Message,
  type UpdateTabsMessage,
  isActivateTabMessage,
  isCloseTabMessage,
} from '@/lib/messages'

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message: Message) => {
    if (isActivateTabMessage(message)) {
      void browser.tabs.update(message.tabId, { active: true })
    }
    if (isCloseTabMessage(message)) {
      void browser.tabs.remove(message.tabId)
    }
  })

  browser.tabs.onActivated.addListener(() => {
    void updateTabs()
  })

  browser.tabs.onUpdated.addListener(() => {
    void updateTabs()
  })

  browser.tabs.onRemoved.addListener(() => {
    void updateTabs()
  })

  browser.tabs.onMoved.addListener(() => {
    void updateTabs() // (reordering tabs)
  })

  browser.tabs.onAttached.addListener(() => {
    void updateTabs()
  })

  browser.tabs.onDetached.addListener((_, detachInfo) => {
    void updateTabs(detachInfo.oldWindowId)
  })

  async function updateTabs(windowId?: number) {
    const query: Browser.tabs.QueryInfo = windowId
      ? { windowType: 'normal', windowId }
      : { windowType: 'normal', currentWindow: true }

    const tabs = await browser.tabs.query(query)
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
