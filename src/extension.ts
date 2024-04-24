import * as vscode from "vscode";
import { SampleTreeViewProvider } from "./sampleTreeViewProvider";
import { OracleDBService } from "./database";

export async function activate(context: vscode.ExtensionContext) {
  const username = await vscode.window.showInputBox({
    prompt: "Enter your Oracle DB username",
  });
  const password = await vscode.window.showInputBox({
    prompt: "Enter your Oracle DB password",
    password: true,
  });
  const serverDb = await vscode.window.showInputBox({
    prompt: "Enter your Oracle DB",
  });

  if (username && password && serverDb) {
    await OracleDBService.initialize(username, password, serverDb);
    const treeDataProvider = new SampleTreeViewProvider();
    vscode.window.createTreeView("sampleTreeView", { treeDataProvider });

    context.subscriptions.push(
      vscode.commands.registerCommand("extension.refreshTreeView", () =>
        treeDataProvider.refresh()
      )
    );
  } else {
    vscode.window.showErrorMessage("Username or password cannot be empty!");
  }
}

export function deactivate() {}
