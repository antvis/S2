<script lang="ts" setup>
import { Spin } from 'ant-design-vue';
</script>

<template>
  <Spin>
    <div></div>
  </Spin>
</template>

<style lang="less">
@import "../../styles/variable.less";

.@{preCls}{
  &-wrapper {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &-container {
    overflow: auto;
    flex: 1 1 auto;

    canvas {
      display: block;
    }
  }
}
</style>
