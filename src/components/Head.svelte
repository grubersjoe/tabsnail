<script lang="ts">
  let head: HTMLElement
  let rot = $state(0)
</script>

<svelte:window
  on:mousemove={e => {
    const rect = head.getBoundingClientRect()
    const x = rect.x + rect.width / 2
    const y = rect.y + rect.height / 2
    const rad = Math.atan2(e.clientX - x, e.clientY - y)
    rot = rad * (180 / Math.PI) * -1
  }}
/>

<div class="head" bind:this={head}>
  <div class="eye" style="transform: rotate({rot}deg)"></div>
  <div class="eye" style="transform: rotate({rot}deg)"></div>
</div>

<style>
  .head {
    pointer-events: all;
    display: flex;
  }

  .eye {
    aspect-ratio: 1;
    position: relative;
    border-radius: 50%;
    background: #ccc;
  }

  .eye:after {
    /*pupil*/
    position: absolute;
    aspect-ratio: 1;
    top: 54%;
    right: 34%;
    width: 34%;
    background: #000;
    border-radius: 50%;
    content: '';
  }
</style>
