<template>
  <div class="container">
    <h1>插件配置</h1>
    <form @submit.prevent="handleSubmit">
      <PathConfig v-model:target-path="targetPath" />
      <BaseSettings v-model:data="baseSettings" />
      <TabSettings v-model:data="pageSettings" />
      <FilePreview :structure="fileStructure" />

      <div class="button-group">
        <button type="submit" id="saveConfig">保存配置</button>
        <button type="button" id="generateComponent" @click="handleGenerateComponent">生成组件</button>
      </div>
    </form>
    <!-- json 数据核对 -->
    <div style="position: fixed;top: 0;left: 0; width: 350px;">
      <json-pretty :data="{
        baseSettings,
        pageSettings
      }" />
    </div>
  </div>
</template>

<script setup>
import { ref, toRaw, getCurrentInstance, computed, watch } from 'vue';
import PathConfig from './components/PathConfig.vue';
import BaseSettings from './components/BaseSettings.vue';
import TabSettings from './components/TabSettings.vue';
import FilePreview from './components/FilePreview.vue';
const { proxy } = getCurrentInstance();

// 表单数据
const targetPath = ref('');
const baseSettings = ref(undefined);
const pageSettings = ref(undefined);

function handleSubmit() {
  // 处理表单提交逻辑
  console.log('表单提交', {
    targetPath: targetPath.value,
    ...toRaw(baseSettings.value),
    ...toRaw(pageSettings.value)
  });
  // 如果在 VS Code 环境中，发送消息到扩展
  proxy?.vscode.postMessage({
    command: 'saveConfig',
    targetPath: targetPath.value,
    ...toRaw(baseSettings.value),
    ...toRaw(pageSettings.value)
  });
}

function handleGenerateComponent() {
  // 处理生成组件逻辑
  console.log('生成组件', {
    targetPath: targetPath.value,
    ...toRaw(baseSettings.value),
    ...toRaw(pageSettings.value)
  });
  const { filterConfig, buttonConfig, tableConfig} = pageSettings.value
  // 如果在 VS Code 环境中，发送消息到扩展
  proxy?.vscode.postMessage({
    command: 'generateComponent',
    targetPath: targetPath.value,
    ...toRaw(baseSettings.value),
    ...filterConfig,
    ...buttonConfig,
    ...tableConfig,
  });
}


// 计算属性 - 文件结构
const fileStructure = computed(
  () => baseSettings.value
    ? buildFileStructure()
    : {});

watch([baseSettings, pageSettings, targetPath], () => {
  // 当 baseSettings、pageSettings 或 targetPath 变化时，重新计算文件结构
  fileStructure.value = buildFileStructure();
}, { deep: true, immediate: false });


// function handleSelectPath() {
//   // 模拟选择路径功能
//   const mockPath = prompt('请输入目标路径:', '/project/src/components');
//   if (mockPath !== null) {
//     targetPath.value = mockPath;
//   }
// }

// function handleUpdateTargetPath(newPath) {
//   targetPath.value = newPath;
// }


// 构建文件结构的函数
function buildFileStructure() {
  const structure = {};
  // 这里实现构建文件结构的逻辑
  const currentModuleName = baseSettings.value.moduleName || "abc-module";
  const currentComponentName = baseSettings.value.componentName || "xyz-component";

  // 获取目标路径作为根节点
  const targetPathValue = targetPath.value;
  const rootPath = targetPathValue.replace(/\\/g, "/").split("/").pop() || "root";

  // 先构建基础结构
  let baseStructure = {
    [currentComponentName]: {
      [`${currentComponentName}.component.html`]: "file",
      [`${currentComponentName}.component.less`]: "file",
      [`${currentComponentName}.component.ts`]: "file",
    },
  };

  // 如果勾选新增按钮或编辑按钮，添加详情组件
  if (pageSettings.value.buttonConfig.hasAddButton || pageSettings.value.tableConfig.hasTableEditButton) {
    baseStructure = {
      [currentComponentName]: {
        [`${currentComponentName}.component.html`]: "file",
        [`${currentComponentName}.component.less`]: "file",
        [`${currentComponentName}.component.ts`]: "file",
        ["detail"]: {
          [`${currentComponentName}-detail.component.html`]: "file",
          [`${currentComponentName}-detail.component.less`]: "file",
          [`${currentComponentName}-detail.component.ts`]: "file",
        },
      },
    };
  }

  structure[rootPath] = {};

  // 如果勾选生成模块
  if (baseSettings.value.generateModule) {
    // 如果模块名与根目录相同，直接在根目录添加文件
    if (currentModuleName === rootPath) {
      structure[rootPath] = {
        ...baseStructure,
        [`${currentModuleName}.module.ts`]: "file",
        [`${currentModuleName}-routing.module.ts`]: "file",
        [`${currentModuleName}.service.ts`]: "file",
        [`${currentModuleName}.const.ts`]: "file",
      };
    } else {
      // 否则创建子模块目录
      structure[rootPath][currentModuleName] = {
        ...baseStructure,
        [`${currentModuleName}.module.ts`]: "file",
        [`${currentModuleName}-routing.module.ts`]: "file",
        [`${currentModuleName}.service.ts`]: "file",
        [`${currentModuleName}.const.ts`]: "file",
      };
    }
  }

  return structure;
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.button-group {
  margin-top: 20px;
}
</style>