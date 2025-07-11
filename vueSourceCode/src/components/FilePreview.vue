<template>
  <div class="section">
    <h2>文件结构预览</h2>

    <div class="file-preview">
      <div v-if="isEmpty(structure)" class="tip-container">
        <span class="tip new">new</span>
        <span class="tip existing">existing</span>
        <span class="tip root">root</span>
      </div>
      <div v-else>
        <TreeItem v-for="(value, key) in structure" :key="key" :name="key" :value="value" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import TreeItem from './TreeItem.vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  structure: {
    type: Object,
    required: true
  }
});

// 判断对象是否为空
function isEmpty(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length === 0;
}
</script>

<style scoped>
.file-preview {
  border: 1px solid #e4e4e4;
  padding: 15px;
  overflow-y: auto;
}

.tip-container {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.tip {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  margin-right: 10px;
}

.root {
  background-color: #ffe0e0;
  color: #c62828;
}

.new {
  background-color: #e0ffe0;
  color: #2e7d32;
}

.existing {
  background-color: #fffde7;
  color: #fbc02d;
}
</style>