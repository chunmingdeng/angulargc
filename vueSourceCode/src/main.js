import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles.less';
import JsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

let vscode = null;
if (typeof acquireVsCodeApi === 'function') {
  // eslint-disable-next-line no-undef
  vscode = acquireVsCodeApi();
}

const app = createApp(App);
app.config.globalProperties.vscode = vscode; // Make vscode API available globally
app.component('JsonPretty', JsonPretty);
app.mount('#app');
