import * as vscode from "vscode";

export class MyTreeItem extends vscode.TreeItem {
  id: string;

  constructor(
    label: string,
    id: string,
    collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.Collapsed
  ) {
    super(label, collapsibleState);
    this.id = id;
    this.tooltip = `${label}`;
    this.description = `ID: ${id}`;
  }
}
