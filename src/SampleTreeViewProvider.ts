import * as vscode from "vscode";
import { HttpClass } from "./httpclass";
import { MyTreeItem } from "./myTreeItem";

type ApiResponseItem = {
  name: string;
  id: string;
  content: string;
  isFile: boolean;
};
type ApiResponse = ApiResponseItem[];

export class SampleTreeViewProvider
  implements vscode.TreeDataProvider<MyTreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    MyTreeItem | undefined | null
  > = new vscode.EventEmitter<MyTreeItem | undefined | null>();
  readonly onDidChangeTreeData: vscode.Event<MyTreeItem | undefined | null> =
    this._onDidChangeTreeData.event;

  private apiUrl: string;
  private httpClass: HttpClass;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    this.httpClass = new HttpClass({
      url: this.apiUrl,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  }

  setApiUrl(url: string): void {
    this.apiUrl = url;
    this.httpClass = new HttpClass({
      url: this.apiUrl,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    this.refresh();
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: MyTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: MyTreeItem): Promise<MyTreeItem[]> {
    if (!element) {
      return this.fetchItems();
    } else {
      return this.fetchItems(element.id);
    }
  }

  private async fetchItems(parentId?: string): Promise<MyTreeItem[]> {
    const apiUrl = parentId ? `${this.apiUrl}=${parentId}` : this.apiUrl;
    try {
      const data = (await this.httpClass.request({
        url: apiUrl,
      })) as ApiResponse;
      return data.map(
        (item) => new MyTreeItem(item.name, item.id, item.content, item.isFile)
      );
    } catch (error) {
      console.error("Failed to load data:", error);
      vscode.window.showErrorMessage("Failed to load data from API.");
      return [];
    }
  }
}
