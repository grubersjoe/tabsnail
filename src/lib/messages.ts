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

export function isTabsMessage(msg: Message): msg is TabsMessage {
  return msg.type === 'tabs'
}

export function isRequestTabsMessage(msg: Message): msg is RequestTabsMessage {
  return msg.type === 'request-tabs'
}

export function isActivateTabMessage(msg: Message): msg is ActivateTabMessage {
  return msg.type === 'activate-tab'
}

export function isCloseTabMessage(msg: Message): msg is CloseTabMessage {
  return msg.type === 'close-tab'
}
