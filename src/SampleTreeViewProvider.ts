// src/treeViewProvider.ts
import * as vscode from "vscode";
import { HttpClass } from "./httpclass";
import { MyTreeItem } from "./myTreeItem";

type ApiResponseItem = { name: string; id: string };
type ApiResponse = ApiResponseItem[];

export class SampleTreeViewProvider
  implements vscode.TreeDataProvider<MyTreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    MyTreeItem | undefined | null
  > = new vscode.EventEmitter<MyTreeItem | undefined | null>();
  readonly onDidChangeTreeData: vscode.Event<MyTreeItem | undefined | null> =
    this._onDidChangeTreeData.event;

  private httpClass = new HttpClass({
    url: "http://office.napr.gov.ge/lr-test/bo/landreg-5/cadtree?FRAME_NAME=CADTREE.BROWSER.JSON&PRNT_ID", // Placeholder API endpoint
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: MyTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: MyTreeItem): Promise<MyTreeItem[]> {
    if (!element) {
      // Fetch root items
      return this.fetchItems();
    } else {
      // Fetch children of the given item
      return this.fetchItems(element.id);
    }
  }

  private async fetchItems(parentId?: string): Promise<MyTreeItem[]> {
    const apiUrl = parentId
      ? `http://office.napr.gov.ge/lr-test/bo/landreg-5/cadtree?FRAME_NAME=CADTREE.BROWSER.JSON&PRNT_ID=${parentId}`
      : "http://office.napr.gov.ge/lr-test/bo/landreg-5/cadtree?FRAME_NAME=CADTREE.BROWSER.JSON&PRNT_ID";
    try {
      const data = (await this.httpClass.request({
        url: apiUrl,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })) as ApiResponse;
      return data.map((item) => new MyTreeItem(item.name, item.id));
    } catch (error) {
      console.error("Failed to load data:", error);
      vscode.window.showErrorMessage("Failed to load data from API.");
      return [];
    }
  }
}
