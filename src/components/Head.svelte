<script lang="ts">
  import Eye from '@/components/Eye.svelte'
  import Eyestalk from '@/components/Eyestalk.svelte'
  import type { Side } from '@/lib/layout.ts'

  let { side }: { side: Side } = $props()
</script>

<div class="head {side}">
  {#if side === 'top'}
    <Eyestalk top="29%" left="48%" rotate="36deg" />
    <Eyestalk top="62%" left="10%" rotate="53deg" />
    <Eye top="65%" left="147%" />
    <Eye top="43%" left="103%" />
  {:else if side === 'right'}
    <Eyestalk top="-29%" left="-148%" rotate="158deg" />
    <Eyestalk top="11%" left="-152%" rotate="132deg" />
    <Eye top="48%" left="-154%" />
    <Eye top="97%" left="-59%" />
  {:else if side === 'bottom'}
    <Eyestalk top="-139%" left="-25%" rotate="210deg" />
    <Eyestalk top="-139%" left="13%" rotate="230deg" />
    <Eye top="-87%" left="-36%" />
    <Eye top="-177%" left="6%" />
  {:else if side === 'left'}
    <Eyestalk top="-20%" left="61%" rotate="306deg" />
    <Eyestalk top="10%" left="72%" rotate="323deg" />
    <Eye top="-112%" left="124%" />
    <Eye top="-75%" left="98%" />
  {/if}
</div>

<style>
  .head {
    position: relative;
    pointer-events: all;
    background: var(--head-bg, #eee);
    outline: solid var(--outline-width) var(--color-outline);
    width: 100%;
    height: 100%;

    --width: 50px;
    --border-radius: 44%;

    &.top {
      width: var(--width);
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
    }

    &.right {
      height: var(--width);
      border-radius: 0 0 var(--border-radius) var(--border-radius);
    }

    &.bottom {
      width: var(--width);
      border-radius: var(--border-radius) 0 0 var(--border-radius);
      margin-left: auto;
    }

    &.left {
      height: var(--width);
      border-radius: var(--border-radius) var(--border-radius) 0 0;
      margin-top: auto;
    }
  }
</style>
