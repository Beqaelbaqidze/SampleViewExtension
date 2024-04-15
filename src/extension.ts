import * as vscode from "vscode";
import { SampleTreeViewProvider } from "./sampleTreeViewProvider";

export async function activate(context: vscode.ExtensionContext) {
  const apiUrl = await vscode.window.showInputBox({
    prompt: "Please enter the API URL",
    placeHolder:
      "http://office.napr.gov.ge/lr-test/bo/landreg-5/cadtree?FRAME_NAME=CADTREE.BROWSER.JSON&PRNT_ID",
    value:
      "http://office.napr.gov.ge/lr-test/bo/landreg-5/cadtree?FRAME_NAME=CADTREE.BROWSER.JSON&PRNT_ID", // Default URL
  });

  if (!apiUrl) {
    vscode.window.showErrorMessage(
      "API URL is required to activate the extension."
    );
    return; // Stop the activation process if no URL is provided
  }

  const treeDataProvider = new SampleTreeViewProvider(apiUrl);
  vscode.window.registerTreeDataProvider("sampleTreeView", treeDataProvider);

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.setApiUrl", async () => {
      const url = await vscode.window.showInputBox({
        prompt: "Please enter the full URL for the API endpoint",
        placeHolder: "Enter the API URL",
        value: treeDataProvider.getApiUrl(),
      });
      if (url) {
        treeDataProvider.setApiUrl(url);
      }
    }),
    vscode.commands.registerCommand("extension.refreshTreeView", () =>
      treeDataProvider.refresh()
    ),
    vscode.commands.registerCommand("extension.openItem", (item: any) => {
      if (item.isFile) {
        const uri = vscode.Uri.file(item.content);
        vscode.commands.executeCommand("vscode.open", uri);
      } else {
        vscode.workspace
          .openTextDocument({ content: item.content, language: "plaintext" })
          .then((doc) => vscode.window.showTextDocument(doc));
      }
    })
  );

  await checkAndSuggestPLSQLExtension();
}

async function checkAndSuggestPLSQLExtension() {
  const plsqlExtensionId = "Oracle.oracledevtools"; // Change this ID based on the actual extension
  const plsqlExtension = vscode.extensions.getExtension(plsqlExtensionId);

  if (!plsqlExtension) {
    const installAction = await vscode.window.showInformationMessage(
      "PL/SQL Developer Tools extension is not installed. Would you like to install it now?",
      "Install",
      "Cancel"
    );

    if (installAction === "Install") {
      vscode.commands
        .executeCommand(
          "workbench.extensions.installExtension",
          plsqlExtensionId
        )
        .then(
          () =>
            vscode.window.showInformationMessage(
              "PL/SQL Developer Tools extension has been installed."
            ),
          (err) =>
            vscode.window.showErrorMessage(
              "Failed to install PL/SQL Developer Tools extension: " + err
            )
        );
    }
  }
}

export function deactivate() {}
