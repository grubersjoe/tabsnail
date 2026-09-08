import {
  type Message,
  type TabsMessage,
  isActivateTabMessage,
  isCloseTabMessage,
  isRequestTabsMessage,
} from '@/lib/messages'

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    if (isRequestTabsMessage(message)) {
      void getTabs(sender.tab?.windowId).then(tabs => {
        sendResponse({ type: 'tabs', tabs } satisfies TabsMessage)
      })
      return true // required for asynchronous responses
    }

    if (isActivateTabMessage(message)) {
      void browser.tabs.update(message.tabId, { active: true })
    }

    if (isCloseTabMessage(message)) {
      void browser.tabs.remove(message.tabId)
    }
  })

  browser.tabs.onActivated.addListener(activeInfo => {
    void sendTabs(activeInfo.windowId)
  })

  browser.tabs.onUpdated.addListener((_tabId, _changeInfo, tab) => {
    void sendTabs(tab.windowId)
  })

  browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
    // There is a race condition in Firefox where the removed tab is still returned
    // by tabs.query() after the onRemoved event, so exclude the tab manually.
    void sendTabs(removeInfo.windowId, tabId)
  })

  browser.tabs.onMoved.addListener((_tabId, moveInfo) => {
    void sendTabs(moveInfo.windowId) // (reordering tabs)
  })

  browser.tabs.onAttached.addListener((_tabId, attachInfo) => {
    void sendTabs(attachInfo.newWindowId)
  })

  browser.tabs.onDetached.addListener((_, detachInfo) => {
    void sendTabs(detachInfo.oldWindowId)
  })

  async function sendTabs(windowId: number, excludeTabId?: number) {
    let tabs: Browser.tabs.Tab[]

    try {
      tabs = await getTabs(windowId)
    } catch (error) {
      console.error(error) // the window may already be gone (just closed)
      return
    }

    if (excludeTabId !== undefined) {
      tabs = tabs.filter(tab => tab.id !== excludeTabId)
    }

    const promises = []
    for (const tab of tabs) {
      if (!tab.id) {
        continue // unexpected
      }

      promises.push(
        browser.tabs.sendMessage<TabsMessage>(tab.id, {
          type: 'tabs',
          tabs: tabs.map(({ id, title, active }) => ({ id, title, active })),
        }),
      )
    }

    return Promise.allSettled(promises)
  }
})

async function getTabs(windowId?: number) {
  const query: Browser.tabs.QueryInfo = windowId
    ? { windowType: 'normal', windowId }
    : { windowType: 'normal', currentWindow: true }

  return browser.tabs.query(query)
}
