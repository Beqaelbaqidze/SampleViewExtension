import * as oracledb from "oracledb";

export class OracleDBService {
  private static poolAlias = "oraclePool";

  static async initialize(
    username: string,
    password: string,
    serverDb: string
  ): Promise<void> {
    await oracledb.createPool({
      user: username,
      password: password,
      connectionString: `10.10.8.46:1521/${serverDb}.napr.local`,
      poolMax: 5,
      poolMin: 1,
      poolAlias: OracleDBService.poolAlias,
    });
    console.log("Oracle connection pool created");
  }

  static async executeQuery<T>(
    query: string,
    params: any[] = []
  ): Promise<T[]> {
    const connection = await oracledb.getConnection(OracleDBService.poolAlias);
    try {
      const result = await connection.execute(query, params, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });
      return (result.rows as T[]) || [];
    } finally {
      await connection.close();
    }
  }
}
