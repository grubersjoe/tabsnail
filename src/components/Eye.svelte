<script lang="ts">
  import { Spring } from 'svelte/motion'

  type Props = {
    top: string
    left: string
  }

  let { top, left }: Props = $props()

  let eye: HTMLElement
  const rot = new Spring(0)

  const shortestDelta = (angle: number) => {
    const diff = (angle - rot.target + 180) % 360
    return (diff < 0 ? diff + 360 : diff) - 180
  }
</script>

<svelte:window
  on:mousemove={e => {
    const rect = eye.getBoundingClientRect()
    const x = rect.x + rect.width / 2
    const y = rect.y + rect.height / 2
    const rad = Math.atan2(e.clientX - x, e.clientY - y)
    const angle = rad * (180 / Math.PI) * -1
    rot.target += shortestDelta(angle)
  }}
/>

<div
  class="eye"
  bind:this={eye}
  style:top
  style:left
  style:transform={`rotate(${rot.current}deg)`}
></div>

<style>
  .eye {
    position: relative;
    aspect-ratio: 1;
    width: 20px;
    border-radius: 50%;
    background: hsl(0, 0%, 96%);
    outline: solid 1px hsl(0, 0%, 76%);
    box-shadow:
      0 0 4px 1px hsl(0, 0%, 60%),
      inset 0 0 1px hsl(0, 0%, 16%);
  }

  /* Pupil */
  .eye:after {
    --width: 34%;
    position: absolute;
    aspect-ratio: 1;
    width: var(--width);
    right: calc(50% - var(--width) / 2); /* center */
    top: 54%;
    background: var(--eye-color, #000);
    border-radius: 50%;
    content: '';
  }
</style>
