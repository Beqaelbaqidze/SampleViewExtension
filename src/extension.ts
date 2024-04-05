// src/extension.ts
import * as vscode from "vscode";
import { SampleTreeViewProvider } from "./SampleTreeViewProvider";

export function activate(context: vscode.ExtensionContext) {
  const treeDataProvider = new SampleTreeViewProvider();
  vscode.window.registerTreeDataProvider("sampleTreeView", treeDataProvider);
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.refreshTreeView", () =>
      treeDataProvider.refresh()
    )
  );
}

export function deactivate() {}
