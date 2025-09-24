type Tab = Pick<chrome.tabs.Tab, 'id' | 'title'>

export type TabListMessage = {
  type: 'tab-list'
  tabs: Tab[]
}

async function sendTabs() {
  const tabs = await chrome.tabs.query({})

  const promises = []
  for (const tab of tabs) {
    if (!tab.id) {
      continue
    }
    promises.push(
      chrome.tabs.sendMessage<TabListMessage>(tab.id, {
        type: 'tab-list',
        tabs: tabs.map(tab => ({
          id: tab.id,
          title: tab.title,
        })),
      }),
    )
  }

  return Promise.allSettled(promises)
}

chrome.tabs.onUpdated.addListener(async () => {
  await sendTabs()
})

chrome.tabs.onRemoved.addListener(async () => {
  await sendTabs()
})
