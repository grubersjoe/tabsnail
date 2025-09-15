type Tab = Pick<chrome.tabs.Tab, 'id' | 'title'>

export type TabListMessage = { type: 'tabList'; tabs: Tab[] }

async function sendTabs() {
  const tabs = await chrome.tabs.query({})

  const promises = []
  for (const tab of tabs) {
    if (tab.id && tab.status === chrome.tabs.TabStatus.COMPLETE) {
      promises.push(
        chrome.tabs.sendMessage<TabListMessage>(tab.id, {
          type: 'tabList',
          tabs: tabs.map(t => ({
            id: t.id,
            title: t.title,
          })),
        }),
      )
    }
  }

  return Promise.allSettled(promises)
}

chrome.tabs.onUpdated.addListener(async () => {
  await sendTabs()
})

chrome.tabs.onRemoved.addListener(async () => {
  await sendTabs()
})
