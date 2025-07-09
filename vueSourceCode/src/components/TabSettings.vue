<template>
  <div class="section">
    <h2>页面设置</h2>
    <!-- Tab 导航 -->
    <div class="tab-container">
      <div class="tab-nav">
        <button v-for="tab in tabs" :key="tab.id" type="button" class="tab-btn"
          :class="{ active: tab.id === localData.activeTab }" @click="handleTabClick(tab.id)">
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab 内容 -->
      <div class="tab-content">
        <!-- 筛选设置 Tab -->
        <div v-show="activeTab === 'filter-tab'" id="filter-tab" class="tab-pane">
          <div class="section tab-section">
            <div class="form-group">
              <input type="checkbox" v-model="localData.filterConfig.hasCompanyFilter" />
              <label>企业筛选</label>
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="localData.filterConfig.hasDateFilter" />
              <label>日期筛选</label>
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="localData.filterConfig.hasInputFilter" />
              <label>输入筛选</label>
            </div>

            <!-- 高级筛选部分 -->
            <div class="filter-group">
              <div class="filter-header">
                <div class="form-group">
                  <input type="checkbox" v-model="localData.filterConfig.hasAdvancedFilter" id="hasAdvancedFilter" />
                  <label>高级筛选</label>
                </div>
              </div>

              <div class="filter-options" id="advancedFilterOptions">
                <transition name="fade">
                  <div v-show="localData.filterConfig.hasAdvancedFilter">
                    <div class="filter-option-row">
                      <div class="form-group radio-group">
                        <input type="radio" v-model="localData.filterConfig.advancedFilterType" value="legacy"
                          id="legacyAdvancedFilter" />
                        <label for="legacyAdvancedFilter">yzf-filter-badge</label>
                      </div>
                      <div class="filter-description">原高级筛选，目前广泛使用的组件</div>
                    </div>
                    <div class="filter-option-row">
                      <div class="form-group radio-group">
                        <input type="radio" v-model="localData.filterConfig.advancedFilterType" value="new"
                          id="newAdvancedFilter" />
                        <label for="newAdvancedFilter">yzf-filter-box</label>
                      </div>
                      <div class="filter-description">新高级筛选，新UI，支持更多筛选类型和更好的用户体验</div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>

        <!-- 按钮设置 Tab -->
        <div v-show="activeTab === 'button-tab'" id="button-tab" class="tab-pane">
          <div class="section tab-section">
            <div class="form-group">
              <input type="checkbox" v-model="localData.buttonConfig.hasAddButton" @change="toggleDetailConfig" />
              <label>新增</label>
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="localData.buttonConfig.hasDeleteButton" />
              <label>批量删除</label>
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="localData.buttonConfig.hasImportButton" />
              <label>导入</label>
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="localData.buttonConfig.hasExportButton" />
              <label>批量导出</label>
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="localData.buttonConfig.hasBatchFilterButton" />
              <label>批量筛选</label>
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="localData.buttonConfig.hasBatchEnableButton" />
              <label>批量启用禁用</label>
            </div>

            <div id="detailConfig">
              <h3>新增/编辑详情配置</h3>
              <div class="form-group">
                <label>弹窗类型：</label>
                <div class="radio-group">
                  <input type="radio" v-model="localData.buttonConfig.detailType" value="drawer" id="drawerOption" />
                  <label for="drawerOption">nzDrawer</label>
                  <input type="radio" v-model="localData.buttonConfig.detailType" value="modal" id="modalOption" />
                  <label for="modalOption">nzModal</label>
                </div>
              </div>
              <div class="form-group">
                <label>实现方式：</label>
                <div class="radio-group">
                  <input type="radio" v-model="localData.buttonConfig.detailImplement" value="template"
                    id="templateOption" />
                  <label for="templateOption">template</label>
                  <input type="radio" v-model="localData.buttonConfig.detailImplement" value="component"
                    id="componentOption" />
                  <label for="componentOption">component</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 表格设置 Tab -->
        <div v-show="activeTab === 'table-tab'" id="table-tab" class="tab-pane">
          <div class="section tab-section">
            <div class="form-group">
              <input type="checkbox" v-model="localData.tableConfig.hasEnhanceTable" />
              <label>新表格（enhance-table）</label>
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="localData.tableConfig.hasTableSelection"
                @change="toggleTableSelectionOptions" />
              <label>多选</label>
            </div>
            <div class="form-group table-selection-option" v-show="localData.tableConfig.hasTableSelection">
              <input type="checkbox" v-model="localData.tableConfig.hasTableCrossPageSelection" />
              <label>全页选&跨页选</label>
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="localData.tableConfig.hasTablePolling" />
              <label>列表轮询</label>
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="localData.tableConfig.hasTableEditButton" @change="toggleDetailConfig" />
              <label>编辑按钮</label>
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="localData.tableConfig.hasTableDeleteButton" />
              <label>删除按钮</label>
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="localData.tableConfig.hasTableViewButton" />
              <label>详情按钮</label>
            </div>
            <div class="form-group">
              <input type="checkbox" v-model="localData.tableConfig.hasTableEnableButton" />
              <label>启用禁用按钮</label>
            </div>
          </div>
        </div>
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

const emit = defineEmits([
  'update:data',
]);

// 定义tabs数据
const tabs = [
  { id: 'filter-tab', label: '筛选设置' },
  { id: 'button-tab', label: '按钮设置' },
  { id: 'table-tab', label: '表格设置' }
];

const localData = computed({
  get: () => props.data || {
    activeTab: 'filter-tab',
    filterConfig: {
      hasCompanyFilter: true,
      hasDateFilter: true,
      hasInputFilter: false,
      hasAdvancedFilter: true,
      advancedFilterType: 'legacy'
    },
    buttonConfig: {
      hasAddButton: true,
      hasDeleteButton: true,
      hasImportButton: false,
      hasExportButton: false,
      hasBatchFilterButton: false,
      hasBatchEnableButton: false,
      detailType: 'drawer',
      detailImplement: 'template'
    },
    tableConfig: {
      hasEnhanceTable: false,
      hasTableSelection: false,
      hasTableCrossPageSelection: false,
      hasTablePolling: false,
      hasTableEditButton: true,
      hasTableDeleteButton: true,
      hasTableViewButton: true,
      hasTableEnableButton: false
    }
  },
  set(value) {
    emit('update:data', value);
  }
});


const activeTab = computed({
  get: () => localData.value.activeTab,
});

watchEffect(() => {
  if (!props.data) {
    emit('update:data', localData.value);
  }
});

function handleTabClick(tabId) {
  localData.value.activeTab = tabId;
}

</script>

<style scoped>
.tab-container {
  border: 1px solid #e4e4e4;
  border-radius: 4px;
  padding: 15px;
}

.tab-nav {
  display: flex;
  margin-bottom: 15px;
}

.tab-btn {
  flex: 1;
  padding: 8px 12px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  font-weight: bold;
}

.tab-btn.active {
  background-color: #ffffff;
  border-bottom: 1px solid #ffffff;
  position: relative;
  z-index: 1;
}

.tab-content {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 0 0 4px 4px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, height 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  height: 0;
}

.filter-group {
  margin-top: 15px;
}

.filter-header {
  margin-bottom: 10px;
}

.filter-options {
  margin-left: 20px;
}

.filter-option-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.radio-group {
  display: flex;
  gap: 10px;
  margin-right: 20px;
}

.filter-description {
  color: #666;
  font-size: 14px;
}

.table-selection-option {
  margin-left: 20px;
}
</style>