import * as vscode from "vscode";

export class MyTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly id?: string,
    public readonly isFile: boolean = false,
    public readonly content?: string
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    this.description = this.contextValue;
  }
}
