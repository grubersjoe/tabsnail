<script lang="ts">
  type Props = {
    style: string
  }

  let { style }: Props = $props()

  let eye: HTMLElement
  let rot = $state(0)
</script>

<svelte:window
  on:mousemove={e => {
    const rect = eye.getBoundingClientRect()
    const x = rect.x + rect.width / 2
    const y = rect.y + rect.height / 2
    const rad = Math.atan2(e.clientX - x, e.clientY - y)
    rot = rad * (180 / Math.PI) * -1
  }}
/>

<div class="eye" bind:this={eye} style="{style}; transform: rotate({rot}deg);"></div>

<style>
  .eye {
    position: relative;
    aspect-ratio: 1;
    width: 20px;
    border-radius: 50%;
    background: #eee;
    outline: solid 1px #ddd;
  }

  /* Pupil */
  .eye:after {
    --width: 34%;
    position: absolute;
    aspect-ratio: 1;
    width: var(--width);
    right: calc(50% - var(--width) / 2); /* center */
    top: 54%;
    background: #000;
    border-radius: 50%;
    content: '';
  }
</style>
