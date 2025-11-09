import {
  type Message,
  type UpdateTabsMessage,
  isActivateTabMessage,
  isCloseTabMessage,
} from '@/lib/messages'

export default defineBackground(() => {
  const ports = new Map<number, Browser.runtime.Port>()

  // Store the port of each content script to exchange messages with it.
  browser.runtime.onConnect.addListener(port => {
    const tabId = port.sender?.tab?.id
    const windowId = port.sender?.tab?.windowId

    if (!tabId) {
      return
    }

    ports.set(tabId, port)

    if (windowId) {
      void updateTabs(windowId)
    }

    port.onMessage.addListener((message: Message) => {
      if (isActivateTabMessage(message)) {
        void browser.tabs.update(message.tabId, { active: true })
      }
      if (isCloseTabMessage(message)) {
        void browser.tabs.remove(message.tabId)
      }
    })

    port.onDisconnect.addListener(() => {
      ports.delete(tabId)
    })
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

    const message: UpdateTabsMessage = {
      type: 'update-tabs',
      tabs: tabs.map(t => ({
        id: t.id,
        title: t.title,
        active: t.active,
      })),
    }

    for (const tab of tabs) {
      if (tab.id) {
        const port = ports.get(tab.id)

        if (port) {
          port.postMessage(message)
        }
      }
    }
  }
})
