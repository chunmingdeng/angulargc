import * as vscode from 'vscode';
import { ComponentGenerator } from './generators/componentGenerator';
import * as path from 'path';
import * as fs from 'fs';

/**
 * 获取Webview资源的完整URI路径
 * @param webview Webview实例
 * @param extensionUri 插件根URI
 * @param pathSegments 路径片段
 */
export function getUri(webview: vscode.Webview, extensionUri: vscode.Uri, pathSegments: string[]): vscode.Uri {
    return webview.asWebviewUri(vscode.Uri.file(path.join(extensionUri.fsPath, ...pathSegments)));
}

export interface ConfigPanelOptions {
    targetPath?: string;
    existingModulePath?: string;
}
export class ConfigPanel {
    public static currentPanel: ConfigPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _targetPath: string | undefined;
    private _existingModulePath: string | undefined;
    private _existingModuleName: string | undefined;

    private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext, options: ConfigPanelOptions = {}) {
        this._panel = panel;
        this._targetPath = options?.targetPath;
        this._existingModulePath = options?.existingModulePath || '';
        const pathParts = this._existingModulePath.replace(/\\/g, '/').split('/');
        this._existingModuleName = pathParts[pathParts.length - 1].replace('.module.ts', '');
        this._panel.webview.html = this._getWebviewContent(context);
        this._setupWebviewHooks(context);
        // 添加面板关闭事件监听
        this._panel.onDidDispose(
            () => {
                ConfigPanel.currentPanel = undefined;
            },
            null,
            context.subscriptions
        );
    }

    private _getWebviewContent(context: vscode.ExtensionContext) {
        const html = fs.readFileSync(path.resolve(context.extensionPath, 'html', 'index.html'), 'utf8');
        const jsuri = getUri(this._panel.webview, context.extensionUri, ['html', 'js']);
        const cssuri = getUri(this._panel.webview, context.extensionUri, ['html', 'css']);
        let re = html.replace(/src=\"js\//g, `src="${jsuri}/`);
        re = re.replace(/href=\"css\//g, `href="${cssuri}/`);
        // vscode.window.showInformationMessage(`html内容：${re}`);
        // vscode.window.showInformationMessage(`jsuri：${jsuri}`);
        return re;
    }

    private _setupWebviewHooks(context: vscode.ExtensionContext) {
        this._panel.webview.onDidReceiveMessage(
            async message => {
                if (message.command === 'webview-ready') {
                    this._panel.webview.postMessage({ command: 'open-devtools' });
                }
                console.log('🚀 -> ConfigPanel -> message:', message);
                const config = {
                    pre: {
                        generateModule: message.generateModule,
                        moduleName: message.moduleName,
                    },
                    basic: {
                        componentName: message.componentName,
                        selectorPrefix: message.selectorPrefix,
                        businessName: message.businessName || '',
                    },
                    filters: {
                        hasCompanyFilter: message.hasCompanyFilter,
                        hasDateFilter: message.hasDateFilter,
                        hasInputFilter: message.hasInputFilter,
                        hasAdvancedFilter: message.hasAdvancedFilter,
                        advancedFilterType: message.hasAdvancedFilter ? message.advancedFilterType : null,
                    },
                    buttons: {
                        hasAddButton: message.hasAddButton,
                        hasDeleteButton: message.hasDeleteButton,
                        hasImportButton: message.hasImportButton,
                        hasExportButton: message.hasExportButton,
                        hasBatchFilterButton: message.hasBatchFilterButton,
                        hasBatchEnableButton: message.hasBatchEnableButton,
                    },
                    table: {
                        hasEnhanceTable: message.hasEnhanceTable,
                        hasSelection: message.hasTableSelection,
                        hasCrossPageSelection: message.hasTableCrossPageSelection,
                        hasPolling: message.hasTablePolling,
                        hasEditButton: message.hasTableEditButton,
                        hasDeleteButton: message.hasTableDeleteButton,
                        hasViewButton: message.hasTableViewButton,
                        hasEnableButton: message.hasTableEnableButton,
                    },
                    detail: {
                        type: message.detailType,
                        implement: message.detailImplement,
                    },
                };
                switch (message.command) {
                    case 'selectPath':
                        const result = await vscode.window.showOpenDialog({
                            canSelectFiles: false,
                            canSelectFolders: true,
                            canSelectMany: false,
                            title: '选择组件生成路径',
                        });
                        if (result && result[0]) {
                            this._targetPath = result[0].fsPath;
                            // this._panel.webview.html = this._getWebviewContent(context);
                            this._panel.webview.postMessage({ command: 'selectedPath', data: this._targetPath });
                        }
                        break;
                    case 'saveConfig':
                        await vscode.workspace.getConfiguration('cgat').update('componentConfig', config, vscode.ConfigurationTarget.Global);
                        vscode.window.showInformationMessage('配置已保存');
                        break;
                    case 'generateComponent':
                        if (!this._targetPath) {
                            vscode.window.showErrorMessage('请选择生成路径');
                            return;
                        }
                        if (!message.componentName) {
                            vscode.window.showErrorMessage('请输入组件名称');
                            return;
                        }

                        // 保存配置
                        await vscode.workspace.getConfiguration('cgat').update('componentConfig', config, vscode.ConfigurationTarget.Global);

                        // 检查目标路径是否已经存在模块文件
                        let existingModulePath = this._existingModulePath;
                        const moduleName = message.moduleName || message.componentName;

                        if (config.pre.generateModule) {
                            const potentialModulePath = path.join(this._targetPath, `${moduleName}/${moduleName}.module.ts`);

                            // 使用fs模块检查文件是否存在
                            if (fs.existsSync(potentialModulePath)) {
                                // 如果模块文件已存在，询问用户是否要使用现有模块
                                const useExisting = await vscode.window.showInformationMessage(
                                    `检测到目标路径已存在模块 ${moduleName}.module.ts，是否使用现有模块？`,
                                    '使用现有模块',
                                    '重新生成'
                                );

                                if (useExisting === '使用现有模块') {
                                    // 更新配置，使用现有模块
                                    config.pre.generateModule = false;
                                    existingModulePath = potentialModulePath;
                                    this._existingModulePath = potentialModulePath;

                                    // 更新模块名称
                                    const pathParts = potentialModulePath.replace(/\\/g, '/').split('/');
                                    this._existingModuleName = pathParts[pathParts.length - 1].replace('.module.ts', '');

                                    // 重要：更新目标路径为模块所在目录，确保组件生成在正确位置
                                    this._targetPath = path.dirname(potentialModulePath);
                                }
                            }
                        } else if (existingModulePath) {
                            // 如果用户选择使用现有模块但没有通过上面的检测流程
                            // 确保目标路径是模块所在目录
                            this._targetPath = path.dirname(existingModulePath);
                            console.log('🚀 -> Using existing module path as target:', this._targetPath);
                        }

                        try {
                            // 创建生成器实例，传入可能更新后的existingModulePath
                            const generator = new ComponentGenerator(context, this._targetPath, existingModulePath);
                            // 接收生成结果
                            const result = await generator.generate(config);

                            // 获取模块名称（无论是新生成的还是现有的）
                            const displayModuleName = config.pre.generateModule ? moduleName : this._existingModuleName;

                            setTimeout(() => {
                                vscode.window.showInformationMessage(`组件 ${message.componentName} 生成成功!`);
                                vscode.window.showInformationMessage(`组件在 ${displayModuleName}.module.ts 中声明成功!`);
                                vscode.window.showInformationMessage(`组件在 ${displayModuleName}-routing.module.ts 中路由声明成功!`);
                                vscode.window.showInformationMessage(`组件相关接口在 ${displayModuleName}.service.ts 中更新成功!`);
                            }, 200);
                        } catch (error: any) {
                            vscode.window.showErrorMessage(`组件生成失败: ${error.message}`);
                        }
                        break;
                }
            },
            undefined,
            context.subscriptions
        );
    }

    public static show(
        context: vscode.ExtensionContext,
        options?: {
            targetPath: any;
            existingModulePath?: any;
        }
    ) {
        if (ConfigPanel.currentPanel) {
            ConfigPanel.currentPanel._panel.reveal();
            return;
        }

        const panel = vscode.window.createWebviewPanel('cgatConfig', 'CGAT 配置', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });

        ConfigPanel.currentPanel = new ConfigPanel(panel, context, options);
    }
}
