"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryAsync = exports.conn = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
// App Variables
dotenv_1.default.config();
// DB CONFIG
const dbConfig = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: 'mysql',
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
// MySQL
// Connect To The Database
exports.conn = mysql2_1.default.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
});
// Query Async
const queryAsync = (sql, values) => {
    return new Promise((resolve, reject) => {
        exports.conn.query(sql, values, (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
};
exports.queryAsync = queryAsync;
