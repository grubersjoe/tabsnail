<script lang="ts">
  type Props = {
    top: string
    left: string
    rotate: string
  }

  let { top, left, rotate }: Props = $props()
</script>

<div class="feeler" style:top style:left style:rotate></div>

<style>
  .feeler {
    position: absolute;
    width: 60px;
    height: 50px;
    border-style: solid;
    border-width: 5px;
    border-color: var(--feeler-bg, #ddd) transparent transparent transparent;
    border-radius: 50% / 30px 30px 0 0;
    z-index: -1;
  }
</style>
