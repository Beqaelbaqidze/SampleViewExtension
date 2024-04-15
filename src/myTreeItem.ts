import * as vscode from "vscode";

export class MyTreeItem extends vscode.TreeItem {
  id: string;
  content: string;
  isFile: boolean;

  constructor(
    label: string,
    id: string,
    content: string,
    isFile: boolean,
    collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.Collapsed
  ) {
    super(label, collapsibleState);
    this.id = id;
    this.content = content;
    this.isFile = isFile;
    this.tooltip = `${label}`;
    this.description = `ID: ${id}`;
    this.command = {
      command: "extension.openItem",
      title: "Open Item",
      arguments: [this],
    };
  }
}
