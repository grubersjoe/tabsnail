import Tabsnail from './Tabsnail.svelte'
import './content.css'
import { mount, unmount } from 'svelte'

export default defineContentScript({
  matches: ['<all_urls>'],
  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'html',
      onMount: container => mount(Tabsnail, { target: container }),
      onRemove: app => {
        if (app) {
          unmount(app).catch(console.error)
        }
      },
    })

    ui.mount()
  },
})
