export type Tab = Pick<chrome.tabs.Tab, 'id' | 'title'>

export type TabListMessage = {
  type: 'list-tabs'
  tabs: Tab[]
}

export type TabSetActiveMessage = {
  type: 'activate-tab'
  tabId: number
}
