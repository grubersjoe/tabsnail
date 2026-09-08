<script lang="ts">
  type Props = {
    top: string
    left: string
    rotate: string
  }

  let { top, left, rotate }: Props = $props()
</script>

<div class="eyestalk" style:top style:left style:rotate></div>

<style>
  .eyestalk {
    position: absolute;
    width: 60px;
    height: 50px;
    border-style: solid;
    border-width: 5px;
    border-color: var(--eyestalk-bg, #ddd) transparent transparent transparent;
    border-radius: 50% / 30px 30px 0 0;
    filter: drop-shadow(0 0px 1px hsl(0, 0%, 40%)); /* can't use box-shadow here */
    z-index: -1;
  }
</style>
