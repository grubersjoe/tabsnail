<script lang="ts">
  import Eye from '@/components/Eye.svelte'
  import Eyestalk from '@/components/Eyestalk.svelte'
  import type { Side } from '@/lib/layout.ts'

  let { side }: { side: Side } = $props()
</script>

<div class="head {side}">
  {#if side === 'top'}
    <Eyestalk top="29%" left="24px" rotate="36deg" />
    <Eyestalk top="62%" left="5px" rotate="53deg" />
    <Eye top="20px" left="67px" />
    <Eye top="19px" left="48px" />
  {:else if side === 'right'}
    <Eyestalk top="0" left="-48px" rotate="160deg" />
    <Eyestalk top="44%" left="-48px" rotate="120deg" />
    <Eye top="34px" left="-42px" />
    <Eye top="42px" left="-30px" />
  {:else if side === 'bottom'}
    <Eyestalk top="-144%" left="-14px" rotate="224deg" />
    <Eyestalk top="-150%" left="4px" rotate="242deg" />
    <Eye top="-36px" left="-20px" />
    <Eye top="-61px" left="0" />
  {:else if side === 'left'}
    <Eyestalk top="-12px" left="21px" rotate="316deg" />
    <Eyestalk top="12px" left="21px" rotate="316deg" />
    <Eye top="-22px" left="52px" />
    <Eye top="-18px" left="54px" />
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
