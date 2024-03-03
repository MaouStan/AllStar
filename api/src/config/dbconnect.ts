import mysql, { MysqlError } from "mysql";
import util from "util";

export const conn = mysql.createPool({
  connectionLimit: 10,
  host: "202.28.34.197",
  user: "web66_65011212122",
  password: "65011212122@csmsu",
  database: "web66_65011212122",
});

export const queryAsync = util.promisify(conn.query).bind(conn);

export async function executeQuery(
  query: string,
  params: any[]
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    conn.query(query, params, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
