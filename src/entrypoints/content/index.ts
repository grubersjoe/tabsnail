import Tabsnail from '../../components/Tabsnail.svelte'
import './tabsnail.css'
import { mount, unmount } from 'svelte'

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    if (ctx.isInvalid) {
      return
    }

    try {
      const ui = await createShadowRootUi(ctx, {
        name: 'tabsnail-ui',
        anchor: 'html',
        position: 'inline',
        isolateEvents: true,
        onMount: (container, shadowRoot) =>
          mount(Tabsnail, { target: container, props: { shadowRoot } }),
        onRemove: app => {
          if (app) {
            unmount(app).catch(console.error)
          }
        },
      })

      ui.mount()
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotSupportedError') {
        return // ignore
      }
      throw error
    }
  },
})
