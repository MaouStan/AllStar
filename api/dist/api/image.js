"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRouter = void 0;
const express_1 = __importDefault(require("express"));
const dbconnect_1 = require("../config/dbconnect");
const storage_1 = require("firebase/storage");
const fireabase_1 = require("../config/fireabase");
const firebase_1 = require("../utils/firebase");
exports.imageRouter = express_1.default.Router();
// GET /api/image/:imageId
exports.imageRouter.get('/random', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const browserId = req.query.browserId;
    const userId = req.query.userId;
    let sql = `
    SELECT image.id, image.userId, image.imageURL, image.name, user.username, user.image
    FROM allstarImages image
    LEFT JOIN allstarUsers user 
        ON user.userId = image.userId
    WHERE NOT EXISTS (
        SELECT 1 FROM allstarVoting voting
        WHERE voting.imageId = image.id
        AND voting.timestamp >= NOW() - INTERVAL (SELECT value FROM allstarSettings WHERE \`key\` = 'ASTime') SECOND
        ${userId ? `AND voting.userId = ${userId}` : browserId ? `AND voting.browserId = '${browserId}'` : ''}
    )
    GROUP BY image.id
    ORDER BY RAND() * COUNT(image.id) + 10 ASC
    LIMIT 2
  `;
    dbconnect_1.conn.query(sql, (err, result) => {
        if (err) {
            return res
                .status(500)
                .json({ status: 'error', message: err });
        }
        res.status(200).json({ status: 'ok', data: result });
    });
}));
// GET /api/image/:imageId/stats
exports.imageRouter.get('/:imageId/stats', (req, res) => {
    const imageId = req.params.imageId;
    const sql1 = `CALL allStarGetImageScores(6, @p1)`;
    const sql2 = `SELECT @p1 as scores`;
    dbconnect_1.conn.query(sql1, [imageId], (err, result) => {
        if (err) {
            return res
                .status(500)
                .json({ status: 'error', message: 'Internal server error' });
        }
        dbconnect_1.conn.query(sql2, (err, result) => {
            if (err) {
                return res
                    .status(500)
                    .json({ status: 'error', message: 'Internal server error' });
            }
            res.status(200).json({ status: 'ok', data: result[0] });
        });
    });
});
// GET /api/image/:imageId/ranks
exports.imageRouter.get('/ranks', (req, res) => {
    const imageId = req.params.imageId;
    let sql = `
    SELECT image.id, image.imageURL, image.name, image.score, image.userId, user.username, user.image, (RANK() OVER (ORDER BY image.score DESC)) as 'rank', COALESCE(yesterday.score, 0) as yesterday_score, COALESCE(yesterday.rank, 0) as yesterday_rank
    FROM allstarImages image
    LEFT JOIN (
        SELECT imageId, allstarVoting.score, (RANK() OVER (ORDER BY score DESC)) as 'rank'
        FROM allstarVoting
        left join allstarImages on allstarVoting.imageId = allstarImages.id
        WHERE DATEDIFF(CURDATE(), timestamp) = 1 and allstarVoting.timestamp >= allstarImages.last_update
    ) as yesterday ON yesterday.imageId = image.id
    left join allstarUsers user on user.userId = image.userId
    ORDER BY 'rank' asc
    LIMIT 10;
  `;
    dbconnect_1.conn.query(sql, [imageId], (err, result) => {
        if (err) {
            // console.log(err)
            return res
                .status(500)
                .json({ status: 'error', message: 'Internal server error' });
        }
        res.status(200).json({ status: 'ok', data: result });
    });
});
// POST /api/image
exports.imageRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.body;
    // check user limit image
    let sql = `
  SELECT COUNT(*) as total, allstarSettings.value as MaxImagePerUser
  FROM allstarImages, allstarSettings
  WHERE userId = ? and allstarSettings.key = 'MaxImagePerUser'`;
    let result = (yield (0, dbconnect_1.queryAsync)(sql, [image.userId]));
    if (!result) {
        return res
            .status(500)
            .json({ status: 'error', message: 'Internal server error' });
    }
    if (result[0].total >= result[0].MaxImagePerUser) {
        return res
            .status(400)
            .json({ status: 'error', message: 'Image limit reached' });
    }
    sql = `INSERT INTO allstarImages (imageURL, name, userId, series_name) VALUES (?, ?, ?, ?)`;
    dbconnect_1.conn.query(sql, [image.imageURL, image.name, image.userId, image.series_name], (err, result) => {
        if (err) {
            console.log(err);
            return res
                .status(500)
                .json({ status: 'error', message: 'Internal server error' });
        }
        res.status(200).json({ status: 'ok', message: 'Image created' });
    });
}));
// Initial a firebase Storage
const storage = (0, storage_1.getStorage)(fireabase_1.app);
// Initial a reference to the storage service, which is used to create references in your storage bucket
const storageRef = (0, storage_1.ref)(storage, 'images');
// PUT -> DELETE, INSERT /api/image/:id
// imageRouter.put('/:id', async (req: Request, res: Response) => {
//   const imageId = req.params.id;
//   const newImageData: ImageNewRequest = req.body;
//   // get old image data
//   let sql = `SELECT * FROM allstarImages WHERE id = ?`;
//   const oldImageData = (await queryAsync(sql, [imageId]) as ImageNewRequest[])[0];
//   if (!oldImageData) {
//     return res
//       .status(404)
//       .json({ status: 'error', message: 'Image not found' });
//   }
//   // remove old image from firebase
//   const { status, message } = await deleteFile(oldImageData.imageURL);
//   if (status === 'error') {
//     return res
//       .status(500)
//       .json({ status: 'error', message: 'Internal server error' });
//   }
//   // remove and new insert
//   sql = `DELETE FROM allstarImages WHERE id = ?`;
//   conn.query(sql, [imageId], (err: QueryError | null, result: OkPacket[]) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ status: 'error', message: 'Internal server error' });
//     }
//     sql = `INSERT INTO allstarImages (imageURL, name, userId, series_name) VALUES (?, ?, ?, ?)`;
//     conn.query(sql, [newImageData.imageURL, newImageData.name, newImageData.userId, newImageData.series_name], (err: QueryError | null, result: OkPacket[]) => {
//       if (err) {
//         return res
//           .status(500)
//           .json({ status: 'error', message: 'Internal server error' });
//       }
//       res.status(200).json({ status: 'ok', message: 'Image updated' });
//     });
//   });
// });
// PUT /api/image/:id
exports.imageRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imageId = req.params.id;
    const newImageData = req.body;
    // get old image data
    let sql = `SELECT * FROM allstarImages WHERE id = ?`;
    const oldImageData = (yield (0, dbconnect_1.queryAsync)(sql, [imageId]))[0];
    if (!oldImageData) {
        return res
            .status(404)
            .json({ status: 'error', message: 'Image not found' });
    }
    // remove old image from firebase
    const { status, message } = yield (0, firebase_1.deleteFile)(oldImageData.imageURL);
    if (status === 'error') {
        return res
            .status(500)
            .json({ status: 'error', message: 'Internal server error' });
    }
    // reset score
    newImageData.score = 1500;
    // update
    sql = `UPDATE allstarImages SET ? WHERE id = ?`;
    dbconnect_1.conn.query(sql, [newImageData, imageId], (err, result) => {
        if (err) {
            return res
                .status(500)
                .json({ status: 'error', message: 'Internal server error' });
        }
        res.status(200).json({ status: 'ok', message: 'Image updated' });
    });
}));
// DELETE /api/image/:id
exports.imageRouter.delete('/:id', (req, res) => {
    const imageId = req.params.id;
    let sql = `DELETE FROM allstarImages WHERE id = ?`;
    dbconnect_1.conn.query(sql, [imageId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res
                .status(500)
                .json({ status: 'error', message: 'Internal server error' });
        }
        // remove image from firebase
        const { status, message } = yield (0, firebase_1.deleteFile)(imageId);
        if (status === 'error') {
            return res
                .status(500)
                .json({ status: 'error', message: 'Internal server error' });
        }
        res.status(200).json({ status: 'ok', message: 'Image deleted' });
    }));
});
