import { type Browser } from 'wxt/browser'

export type Tab = Pick<Browser.tabs.Tab, 'id' | 'title' | 'active'>

export type UpdateTabsMessage = {
  type: 'update-tabs'
  tabs: Tab[]
}

export type ActivateTabMessage = {
  type: 'activate-tab'
  tabId: number
}

export type CloseTabMessage = {
  type: 'close-tab'
  tabId: number
}

export type Message = UpdateTabsMessage | ActivateTabMessage | CloseTabMessage

export function isUpdateTabsMessage(msg: Message): msg is UpdateTabsMessage {
  return msg.type === 'update-tabs'
}

export function isActivateTabMessage(msg: Message): msg is ActivateTabMessage {
  return msg.type === 'activate-tab'
}

export function isCloseTabMessage(msg: Message): msg is CloseTabMessage {
  return msg.type === 'close-tab'
}
