import * as vscode from 'vscode';
import { ConfigPanel } from './view/configPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "plugin01" is now active!');

    const disposable = vscode.commands.registerCommand('acg.openConfig', (uri: vscode.Uri|undefined) => {
        vscode.window.showInformationMessage(`set your config! ${uri?.fsPath}`);
        ConfigPanel.show(context, {
            targetPath: uri?.fsPath,
        });
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
