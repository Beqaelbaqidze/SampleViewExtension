import * as vscode from "vscode";
import { OracleDBService } from "./database";
import { MyTreeItem } from "./myTreeItem";

export class SampleTreeViewProvider
  implements vscode.TreeDataProvider<MyTreeItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    MyTreeItem | undefined
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  getTreeItem(element: MyTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: MyTreeItem): Promise<MyTreeItem[]> {
    if (!element) {
      return [
        new MyTreeItem(
          "Oracle Database",
          vscode.TreeItemCollapsibleState.Collapsed,
          "database"
        ),
      ];
    } else if (element.contextValue === "database") {
      return this.fetchDatabaseObjects();
    } else if (
      element.contextValue === "table" ||
      element.contextValue === "view"
    ) {
      return this.fetchTableDetails(element.label);
    } else if (
      element.contextValue === "procedure" ||
      element.contextValue === "function"
    ) {
      return this.fetchProcedureFunctionDetails(
        element.label,
        element.contextValue
      );
    }
    return [];
  }

  private async fetchDatabaseObjects(): Promise<MyTreeItem[]> {
    // Fetch tables
    const tableQuery = `SELECT table_name FROM user_tables`;
    const tables = await OracleDBService.executeQuery<{ TABLE_NAME: string }>(
      tableQuery
    );
    const tableItems = tables.map(
      (table) =>
        new MyTreeItem(
          table.TABLE_NAME,
          vscode.TreeItemCollapsibleState.Collapsed,
          "table"
        )
    );

    // Fetch views
    const viewQuery = `SELECT view_name FROM user_views`;
    const views = await OracleDBService.executeQuery<{ VIEW_NAME: string }>(
      viewQuery
    );
    const viewItems = views.map(
      (view) =>
        new MyTreeItem(
          view.VIEW_NAME,
          vscode.TreeItemCollapsibleState.Collapsed,
          "view"
        )
    );

    // Fetch procedures
    const procedureQuery = `SELECT object_name FROM user_procedures WHERE object_type = 'PROCEDURE'`;
    const procedures = await OracleDBService.executeQuery<{
      OBJECT_NAME: string;
    }>(procedureQuery);
    const procedureItems = procedures.map(
      (proc) =>
        new MyTreeItem(
          proc.OBJECT_NAME,
          vscode.TreeItemCollapsibleState.Collapsed,
          "procedure"
        )
    );

    // Fetch functions
    const functionQuery = `SELECT object_name FROM user_procedures WHERE object_type = 'FUNCTION'`;
    const functions = await OracleDBService.executeQuery<{
      OBJECT_NAME: string;
    }>(functionQuery);
    const functionItems = functions.map(
      (func) =>
        new MyTreeItem(
          func.OBJECT_NAME,
          vscode.TreeItemCollapsibleState.Collapsed,
          "function"
        )
    );

    // Combine all items
    return [...tableItems, ...viewItems, ...procedureItems, ...functionItems];
  }

  private async fetchTableDetails(tableName: string): Promise<MyTreeItem[]> {
    const columns = await OracleDBService.executeQuery<{ COLUMN_NAME: string }>(
      `SELECT column_name FROM all_tab_columns WHERE table_name = :1`,

      [tableName]
    );
    return columns.map(
      (column) =>
        new MyTreeItem(
          column.COLUMN_NAME,
          vscode.TreeItemCollapsibleState.None,
          "column"
        )
    );
  }
  private async fetchProcedureFunctionDetails(
    name: string,
    type: string
  ): Promise<MyTreeItem[]> {
    const paramQuery = `SELECT argument_name FROM all_arguments WHERE object_name = :1 AND package_name IS NULL ORDER BY sequence`;
    const params = await OracleDBService.executeQuery<{
      ARGUMENT_NAME: string;
    }>(paramQuery, [name]);
    return params.map(
      (param) =>
        new MyTreeItem(
          param.ARGUMENT_NAME,
          vscode.TreeItemCollapsibleState.None,
          "parameter"
        )
    );
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
}
