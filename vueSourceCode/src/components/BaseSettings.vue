<template>
  <div class="section">
    <h2>基础设置</h2>
    <div class="form-row">
      <div class="form-group">
        <input type="checkbox" v-model="localData.generateModule" />
        <span>生成模块(包含路由、服务)</span>
      </div>
      <div class="form-group" id="moduleNameGroup">
        <label>模块名称：</label>
        <input type="text" v-model="localData.moduleName" :disabled="!localData.generateModule" />
      </div>
      <div class="form-group">
        <label>组件名称：</label>
        <input type="text" v-model="localData.componentName" required />
      </div>
      <div class="form-group">
        <label>业务名称：</label>
        <input type="text" v-model="localData.businessName" />
      </div>
      <div class="form-group">
        <label>选择器前缀：</label>
        <input type="text" v-model="localData.selectorPrefix" value="" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, watchEffect } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: null
  },
});

const emit = defineEmits(['update:data']);

const localData = computed({
  get: () => props.data || {
    generateModule: true,
    moduleName: '',
    componentName: '',
    businessName: '',
    selectorPrefix: 'yzf'
  },
  set: (value) => emit('update:data', value)
})

// 如果 data 是 undefined 或 null，主动触发一次赋值给父组件
watchEffect(() => {
  if (!props.data) {
    emit('update:data', localData.value)
  }
})

</script>

<style scoped>
.section {
  background-color: #f9f9f9;
  border: 1px solid #e4e4e4;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;

  .form-row {
    display: flex;
    flex-wrap: wrap;
    column-gap: 20px;
    margin-bottom: 10px;

    .form-group {
      flex: 0 0 calc(50% - 10px);
      display: flex;

      label {
        /* flex: 1; */
        width: 180px;
        line-height: 28px;
        text-align: right;
      }
    }
  }
}
</style>