"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
const dbconnect_1 = require("./config/dbconnect");
//For env File
dotenv_1.default.config();
//For Port
const PORT = process.env.PORT || 3000;
app_1.app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    dbconnect_1.conn.connect((err) => {
        if (err) {
            console.log('Error Connecting To The Database', err);
            return;
        }
        console.log('Connected To The Database');
    });
});
