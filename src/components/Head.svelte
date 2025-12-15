<script>
  import Eye from '@/components/Eye.svelte'
</script>

<div class="head">
  <div class="feeler">
    <Eye style="top: -5px; left: 32px;" />
  </div>
  <div class="feeler">
    <Eye style="top: -5px; left: 32px;" />
  </div>
</div>

<style>
  .head {
    position: relative;
    pointer-events: all;
    width: 50px;
    background: #eee;
    outline: solid 1px #ddd;
    border-radius: 0 50% 40% 0;
  }

  .feeler {
    position: absolute;
    width: 60px;
    height: 50px;
    border-style: solid;
    border-width: 5px;
    border-color: #ddd transparent transparent transparent;
    border-radius: 50% / 30px 30px 0 0;
    z-index: -1;

    &:nth-of-type(1) {
      top: 29%;
      right: -34px;
      transform: rotate(36deg);
    }

    &:nth-of-type(2) {
      top: 62%;
      right: -15px;
      transform: rotate(53deg);
    }
  }
</style>
