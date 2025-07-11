<template>
  <div class="tree-item" role="treeitem" aria-expanded="false">
    <span :class="[
      'node',
      isRoot ? 'root' : '',
      isFolder ? 'folder' : 'file',
      isExisting ? 'existing' : ''
    ]">
      {{ name }}<template v-if="isFolder">/</template>
    </span>

    <div v-if="isFolder && !isExisting" class="children" role="group">
      <div v-for="(childValue, childName) in value" :key="childName" class="child-item">
        <TreeItem v-if="typeof childValue === 'object' && !Array.isArray(childValue)" :name="childName"
          :value="childValue" />
        <div v-else-if="childValue === 'file' || (typeof childValue === 'object' && childValue._existing)"
          class="file-item" role="treeitem">
          <span :class="[
            'node',
            isRoot ? 'root' : '',
            typeof childValue === 'object' && childValue._existing ? 'existing' : '',
          ]">
            {{ childName }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  value: {
    type: [Object, String],
    required: true
  }
});

// 判断是否是根节点
const isRoot = computed(() => {
  // 这里简单实现为name包含"root"的情况
  // 实际使用时可以根据需要调整判断逻辑
  return props.name.toLowerCase().includes('root');
});

// 判断是否是现有文件或目录
const isExisting = computed(() => {
  return typeof props.value === 'object' && props.value._existing;
});

// 判断是否是文件夹
const isFolder = computed(() => {
  return typeof props.value === 'object' && !props.value._existing;
});
</script>

<style scoped>
.tree-item {
  margin-left: 20px;
}

.node {
  display: inline-block;
  padding: 2px 4px;
  border-radius: 4px;
  cursor: default;
  color: #333;
}

.folder {
  color: #2c3e50;
}

.file {
  color: #42b983;
}

.root {
  color: #c62828;
  font-weight: bold;
}

.existing {
  color: #fbc02d;
  background-color: rgba(251, 192, 45, 0.1);
}

.new {
  color: #2e7d32;
}

.children {
  margin-left: 10px;
  border-left: 1px solid #e0e0e0;
  padding-left: 10px;
}

:deep(.child-item:last-child) {
  margin-bottom: 4px;
}

/* 悬停效果 */
.node:hover {
  background-color: #f5f5f5;
}

/* 根节点悬停效果 */
.root:hover {
  background-color: rgba(198, 40, 40, 0.1);
}

.node.folder {
  font-weight: bold;
  background-color: #2e7d32;
  color: #fff;
}
.tree-item {
  position: relative;
  &::before {
    content: '-📁 ';
    position: absolute;
    left: -31px;
    top: 4px;
  }
}
</style>