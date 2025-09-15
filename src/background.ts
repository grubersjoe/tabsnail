type Tab = Pick<chrome.tabs.Tab, 'id' | 'title'> & {
  gridPosition: [number, number]
}

export type TabListMessage = {
  type: 'tabList'
  tabs: Tab[]
  gridDimensions: [number, number]
}

async function sendTabs() {
  const tabs = await chrome.tabs.query({})

  // const gridSize = Math.ceil(Math.sqrt(tabs.length))
  const gridDimensions: [number, number] = [10, 20]
  const snailPositions = snailOrder(gridDimensions)

  const promises = []
  for (const tab of tabs) {
    if (tab.id && tab.status === chrome.tabs.TabStatus.COMPLETE) {
      promises.push(
        chrome.tabs.sendMessage<TabListMessage>(tab.id, {
          type: 'tabList',
          tabs: tabs.map((tab, index) => ({
            id: tab.id,
            title: tab.title,
            gridPosition: snailPositions[index],
          })),
          gridDimensions,
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

function snailOrder([cols, rows]: [number, number]): [number, number][] {
  let top = 0
  let bottom = rows - 1
  let left = 0
  let right = cols - 1

  let result: [number, number][] = []
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) result.push([top, c])
    top++

    for (let r = top; r <= bottom; r++) result.push([r, right])
    right--

    if (top <= bottom) {
      for (let c = right; c >= left; c--) result.push([bottom, c])
      bottom--
    }

    if (left <= right) {
      for (let r = bottom; r >= top; r--) result.push([r, left])
      left++
    }
  }

  return result
}
