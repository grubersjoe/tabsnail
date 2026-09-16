import { type Browser } from 'wxt/browser'

export type Tab = Pick<Browser.tabs.Tab, 'id' | 'title' | 'active'>

export type TabsMessage = {
  type: 'tabs'
  tabs: Tab[]
}

export type RequestTabsMessage = {
  type: 'request-tabs'
}

export type ActivateTabMessage = {
  type: 'activate-tab'
  tabId: number
}

export type CloseTabMessage = {
  type: 'close-tab'
  tabId: number
}

export type Message = TabsMessage | RequestTabsMessage | ActivateTabMessage | CloseTabMessage
