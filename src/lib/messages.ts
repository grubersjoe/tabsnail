export type UpdateTabsMessage = {
  type: 'update-tabs'
  tabs: Pick<chrome.tabs.Tab, 'id' | 'title' | 'active'>[]
}

export function isUpdateTabsMessage(msg: { type: string }): msg is UpdateTabsMessage {
  return msg.type === 'update-tabs'
}

export type ActivateTabMessage = {
  type: 'activate-tab'
  tabId: number
}

export function isActivateTabMessage(msg: { type: string }): msg is ActivateTabMessage {
  return msg.type === 'activate-tab'
}

export type CloseTabMessage = {
  type: 'close-tab'
  tabId: number
}

export function isCloseTabMessage(msg: { type: string }): msg is CloseTabMessage {
  return msg.type === 'close-tab'
}
