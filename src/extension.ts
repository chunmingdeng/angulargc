import * as vscode from 'vscode';
import { ConfigPanel } from './view/configPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "plugin01" is now active!');

    const disposable = vscode.commands.registerCommand('angularcg.openConfig', () => {
        vscode.window.showInformationMessage('set your config!');
        ConfigPanel.show(context);
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
