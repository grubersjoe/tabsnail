<script lang="ts">
  import closeIcon from '@/assets/close.svg?raw'
  import { className, isDarkColor } from '@/lib'
  import { setViewportBounds, snailBounds, snailGrid } from '@/lib/layout'
  import {
    type ActivateTabMessage,
    type CloseTabMessage,
    type Message,
    type Tab,
    isUpdateTabsMessage,
  } from '@/lib/messages'
  import { defaultSettings, getSettingsSnapshot, settingsStorage } from '@/lib/settings'
  import { loadTheme, themes } from '@/lib/themes'
  import { onDestroy } from 'svelte'

  let tabs = $state<Tab[]>([])
  let settings = $state(defaultSettings)

  let clientWidth = $state(document.documentElement.clientWidth)
  let clientHeight = $state(document.documentElement.clientHeight)
  let cellSize = $derived(themes[settings.theme].cellSizePx)
  let gridColumns = $derived(Math.round(clientWidth / cellSize))
  let gridRows = $derived(Math.round(clientHeight / cellSize))
  let grid = $derived(snailGrid(gridColumns, gridRows, settings.tabSize))
  let bounds = $derived(snailBounds(gridColumns, gridRows, grid.slice(0, tabs.length)))

  let fullscreenElement = $state(document.fullscreenElement)
  let isFullscreen = $derived(fullscreenElement !== null)

  getSettingsSnapshot()
    .then(snapshot => {
      settings = snapshot
      loadTheme(snapshot.theme)
    })
    .catch(console.error)

  const port = browser.runtime.connect()

  port.onMessage.addListener((message: Message) => {
    if (isUpdateTabsMessage(message)) {
      tabs = message.tabs
    }
  })

  settingsStorage.color.watch(color => {
    settings.color = color
  })

  settingsStorage.shrinkViewport.watch(shrinkViewport => {
    settings.shrinkViewport = shrinkViewport
  })

  settingsStorage.tabSize.watch(tabSize => {
    settings.tabSize = tabSize
  })

  settingsStorage.theme.watch(theme => {
    settings.theme = theme
    loadTheme(theme)
  })

  $effect(() => {
    setViewportBounds(settings.shrinkViewport && !isFullscreen, bounds)
  })

  onDestroy(() => {
    port.disconnect()
  })
</script>

<svelte:document bind:fullscreenElement />

<div
  id="tabsnail"
  bind:clientWidth
  bind:clientHeight
  class={[className('theme'), isDarkColor(settings.color) && className('dark')]}
  hidden={isFullscreen}
  style:--grid-columns={gridColumns}
  style:--grid-rows={gridRows}
  style:--color={settings.color}
>
  {#each tabs as tab, i (tab.id)}
    {#if grid[i]}
      <div
        style:grid-row-start={grid[i].rowStart}
        style:grid-column-start={grid[i].columnStart}
        style:grid-row-end={grid[i].rowEnd}
        style:grid-column-end={grid[i].columnEnd}
        class={[className(grid[i].side), tab.active ? className('active') : '']}
      >
        <button
          type="button"
          class={className('btn-activate')}
          onclick={() => {
            if (tab.id) {
              const message: ActivateTabMessage = { type: 'activate-tab', tabId: tab.id }
              port.postMessage(message)
            }
          }}
        >
          {tab.title ?? ''}
        </button>

        <button
          type="button"
          class={className('btn-close')}
          onclick={() => {
            if (tab.id) {
              const message: CloseTabMessage = { type: 'close-tab', tabId: tab.id }
              port.postMessage(message)
            }
          }}
        >
          {@html closeIcon}
        </button>
      </div>
    {/if}
  {/each}
</div>
