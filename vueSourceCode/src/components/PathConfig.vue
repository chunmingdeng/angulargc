<template>
  <div class="section">
    <h2>生成路径</h2>
    <div class="form-group">
      <label>目标路径：</label>
      <!-- <span v-if="targetPath" id="targetPath">{{ targetPath }}</span> -->
      <div class="path-input">
        <input type="text" v-model="targetPathInput" required @input="handleInput" disabled />
        <button type="button" id="selectPath" @click="handleSelectPath">选择路径</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance()

const props = defineProps({
  targetPath: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:targetPath']);

const targetPathInput = ref(props.targetPath);

// 监听输入变化，保持与父组件同步
watch(
  () => props.targetPath,
  (newVal) => {
    targetPathInput.value = newVal;
  }
);

function handleSelectPath() {
  proxy?.vscode.postMessage({ command: "selectPath" });
}

function handleInput() {
  const newPath = targetPathInput.value.trim();
  if (newPath === '') {
    console.warn('目标路径不能为空');
    return;
  }
  emit('update:targetPath', newPath);
}


window.addEventListener('message', (event) => {
  console.log('页面vscode的postmessage:', event);
  const message = event.data
  if (message.command === 'selectedPath') {
    console.log('页面接收到选中的路径:', message);
    emit('update:targetPath', message.data);
  } else if (message.command === 'UPDATE_TARGET_PATH') {
    console.log('页面接收到更新的目标路径:', message.data);
    targetPathInput.value = message.data;
  }
})
</script>

<style scoped>
.path-input {
  display: flex;
  gap: 10px;
}

input[type="text"] {
  flex: 1;
}
</style>