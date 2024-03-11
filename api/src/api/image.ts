import express, { Request, Response } from 'express';
import { IMAGE_TABLE, conn, queryAsync } from '../config/dbconnect';
import { QueryError, OkPacket } from 'mysql2';
import { ImageNewRequest } from '../model/image_new_req';
import { getStorage, ref } from 'firebase/storage';
import { app } from '../config/fireabase';
import { deleteFile, uploadFile } from '../utils/firebase';
import { FileMiddleware } from '../middleware/file_middleware';

export const imageRouter = express.Router();

// GET /api/image/:imageId
imageRouter.get('/random', async (req: Request, res: Response) => {
  const browserId: string = req.query.browserId as string;
  const userId: string = req.query.userId as string;

  let sql = `
    SELECT image.id, image.userId, image.imageURL, image.name, user.username, user.image as userImage, COUNT(voting.imageId) as voteCount
    FROM allstarImages image
    LEFT JOIN allstarUsers user
        ON user.userId = image.userId
    LEFT JOIN allstarVoting voting
        ON voting.imageId = image.id
    WHERE NOT EXISTS (
        SELECT 1 FROM allstarVoting
        WHERE imageId = image.id
        AND timestamp >= NOW() - INTERVAL (SELECT value FROM allstarSettings WHERE \`key\` = 'ASTime') SECOND
        ${userId ? `AND userId = ${userId}` : browserId ? `AND browserId = '${browserId}'` : ''}
    )
    GROUP BY image.id
    ORDER BY RAND() * COUNT(voting.imageId) + 10 ASC
    LIMIT 2
  `;

  conn.query(sql, (err: QueryError, result: OkPacket) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: err });
    }
    res.status(200).json({ status: 'ok', data: result });
  });
});

// GET /api/image/:imageId/stats
imageRouter.get('/:imageId/stats', (req: Request, res: Response) => {
  const imageId = req.params.imageId;
  const sql1 = `CALL allStarGetImageScores(?, @p1)`;
  const sql2 = `SELECT @p1 as scores`;

  conn.query(sql1, [imageId], (err: QueryError | null, result: OkPacket[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }

    conn.query(sql2, (err: QueryError | null, result: OkPacket[]) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 'error', message: 'Internal server error' });
      }

      res.status(200).json({ status: 'ok', data: result[0] });
    });
  });
});

// GET /api/image/top10
imageRouter.get('/top10', (req: Request, res: Response) => {
  const imageId = req.params.imageId;
  let sql = `
    SELECT ai.*,
      u.username AS user_username,
      u.image AS user_image,
      RANK() OVER (ORDER BY currentScore DESC) AS currentRank,
      currentScore,
      yesterdayRank,
      yesterdayScore
    FROM (
    SELECT ai.*,
          COALESCE(v.score, ai.score) AS currentScore
    FROM allstarImages ai
    LEFT JOIN (
      SELECT imageId, score
      FROM (
          SELECT imageId, score, timestamp,
                  RANK() OVER (PARTITION BY imageId ORDER BY timestamp DESC) AS rn
          FROM allstarVoting
          WHERE DATE(timestamp) = CURDATE()
      ) latest_scores
      WHERE rn = 1
    ) v ON ai.id = v.imageId
    ) ai
    LEFT JOIN (
    SELECT ai.id,
          COALESCE(v2.score, ai.score) AS yesterdayScore,
          RANK() OVER (ORDER BY COALESCE(v2.score, ai.score) DESC) AS yesterdayRank
    FROM allstarImages ai
    LEFT JOIN (
      SELECT imageId, score, timestamp
      FROM (
          SELECT imageId, score, timestamp,
                  RANK() OVER (PARTITION BY imageId ORDER BY timestamp DESC) AS rn
          FROM allstarVoting
          WHERE DATE(timestamp) = CURDATE() - INTERVAL 1 DAY
      ) latest_scores
      WHERE rn = 1
    ) v2 ON ai.id = v2.imageId
    ) yesterday ON ai.id = yesterday.id
    LEFT JOIN allstarUsers u ON ai.userId = u.userId
    ORDER BY currentRank ASC
    LIMIT 10;
  `

  conn.query(sql, [imageId], (err: QueryError | null, result: OkPacket[]) => {
    if (err) {
      // console.log(err)
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }

    res.status(200).json({ status: 'ok', data: result });
  });
});

// GET /api/image/ranks
imageRouter.get('/ranks', (req: Request, res: Response) => {
  const sql = `
    SELECT ai.*,
      u.username AS user_username,
      u.image AS user_image,
      RANK() OVER (ORDER BY currentScore DESC) AS currentRank,
      currentScore,
      yesterdayRank,
      yesterdayScore
    FROM (
    SELECT ai.*,
          COALESCE(v.score, ai.score) AS currentScore
    FROM allstarImages ai
    LEFT JOIN (
      SELECT imageId, score
      FROM (
          SELECT imageId, score, timestamp,
                  RANK() OVER (PARTITION BY imageId ORDER BY timestamp DESC) AS rn
          FROM allstarVoting
          WHERE DATE(timestamp) = CURDATE()
      ) latest_scores
      WHERE rn = 1
    ) v ON ai.id = v.imageId
    ) ai
    LEFT JOIN (
    SELECT ai.id,
          COALESCE(v2.score, ai.score) AS yesterdayScore,
          RANK() OVER (ORDER BY COALESCE(v2.score, ai.score) DESC) AS yesterdayRank
    FROM allstarImages ai
    LEFT JOIN (
      SELECT imageId, score, timestamp
      FROM (
          SELECT imageId, score, timestamp,
                  RANK() OVER (PARTITION BY imageId ORDER BY timestamp DESC) AS rn
          FROM allstarVoting
          WHERE DATE(timestamp) = CURDATE() - INTERVAL 1 DAY
      ) latest_scores
      WHERE rn = 1
    ) v2 ON ai.id = v2.imageId
    ) yesterday ON ai.id = yesterday.id
    LEFT JOIN allstarUsers u ON ai.userId = u.userId
    ORDER BY currentRank ASC;
  `;

  conn.query(sql, (err: QueryError | null, result: OkPacket[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }

    res.status(200).json({ status: 'ok', data: result });
  });
});

// // Initial a firebase Storage
// const storage = getStorage(app);

// // Initial a reference to the storage service, which is used to create references in your storage bucket
// const storageRef = ref(storage, 'images');
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
imageRouter.put('/:id', async (req: Request, res: Response) => {
  const imageId = req.params.id;
  const newImageData: IMAGE_TABLE & { score: number } = req.body;

  // get old image data
  let sql = `SELECT * FROM allstarImages WHERE id = ?`;
  const oldImageData = (await queryAsync(sql, [imageId]) as IMAGE_TABLE[])[0];
  if (!oldImageData) {
    return res
      .status(404)
      .json({ status: 'error', message: 'Image not found' });
  }

  // remove old image from firebase
  const { status, message } = await deleteFile(oldImageData.imageURL);
  if (status === 'error') {
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' });
  }

  // reset score
  newImageData.score = 1500;

  // timestamp
  newImageData.last_update = new Date();

  // update
  sql = `UPDATE allstarImages SET ? WHERE id = ?`;
  conn.query(sql, [newImageData, imageId], (err: QueryError | null, result: OkPacket[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }
    res.status(200).json({ status: 'ok', message: 'Image updated' });
  });
});


// DELETE /api/image/:id
imageRouter.delete('/:id', (req: Request, res: Response) => {
  const imageId = req.params.id;
  let sql = `DELETE FROM allstarImages WHERE id = ?`;

  conn.query(sql, [imageId], async (err: QueryError | null, result: OkPacket[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }

    // remove image from firebase
    const { status, message } = await deleteFile(imageId);
    if (status === 'error') {
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }

    res.status(200).json({ status: 'ok', message: 'Image deleted' });
  });
});


// config multipart/form-data requests multer
const fileMiddleware = new FileMiddleware();

// POST /api/image
imageRouter.post('/', fileMiddleware.diskLoader.single('file'), async (req: Request, res: Response) => {
  const image: ImageNewRequest = req.body;
  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .json({ status: 'error', message: 'Invalid Input' });
  }

  // check user limit image
  let sql = `
  SELECT COUNT(*) as total, (select allstarSettings.value from allstarSettings where allstarSettings.key = 'MaxImagePerUser') as MaxImagePerUser
  FROM allstarImages
  where allstarImages.userId = ?`;

  let result: any = (await queryAsync(sql, [image.userId]));
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

  const imageURL = await uploadFile(file);
  if (imageURL === null) {
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' });
  }

  sql = `INSERT INTO allstarImages (imageURL, name, userId, series_name) VALUES (?, ?, ?, ?)`;
  conn.query(sql, [imageURL, image.name, image.userId, image.series_name], (err: QueryError | null, result: OkPacket[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }
    res.status(200).json({ status: 'ok', message: 'Image created' });
  });

});
