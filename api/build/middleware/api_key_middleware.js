"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkApiKey = void 0;
const dbconnect_1 = require("../config/dbconnect");
// checkApiKey in db
const checkApiKeyInDB = (apikey) => {
    dbconnect_1.conn.query("SELECT 1 FROM allstarSettings where key = apikey and value = ?;", [apikey], (err, results) => {
        if (err) {
            return false;
        }
        if (results.affectedRows === 0) {
            return false;
        }
        return true;
    });
    return true;
};
// Middleware function to check API key
const checkApiKey = (req, res, next) => {
    const apiKey = req.query.apikey; // Cast the value to string
    if (!apiKey || !checkApiKeyInDB(apiKey)) {
        return res.status(401).json({ error: "Invalid API key" });
    }
    // API key is valid, continue to the next middleware/route handler
    next();
};
exports.checkApiKey = checkApiKey;
//# sourceMappingURL=api_key_middleware.js.map