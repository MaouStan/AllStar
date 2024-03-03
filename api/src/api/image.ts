import express, { Request, Response } from 'express';
import { conn, queryAsync } from '../config/dbconnect';
import { QueryError, OkPacket } from 'mysql2';
import { ImageNewRequest } from '../model/image_new_req';
import { getStorage, ref } from 'firebase/storage';
import { app } from '../config/fireabase';
import { deleteFile } from '../utils/firebase';

export const imageRouter = express.Router();

// GET /api/image/:imageId
imageRouter.get('/random', async (req: Request, res: Response) => {
  const browserId: string = req.query.browserId as string;
  const userId: string = req.query.userId as string;

  let sql = `
    SELECT image.id, image.userId, image.imageURL, image.name, user.username, user.image as userImage
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

// GET /api/image/ranks
imageRouter.get('/ranks', (req: Request, res: Response) => {
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

// POST /api/image
imageRouter.post('/', async (req: Request, res: Response) => {
  const image: ImageNewRequest = req.body;
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

  sql = `INSERT INTO allstarImages (imageURL, name, userId, series_name) VALUES (?, ?, ?, ?)`;
  conn.query(sql, [image.imageURL, image.name, image.userId, image.series_name], (err: QueryError | null, result: OkPacket[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }
    res.status(200).json({ status: 'ok', message: 'Image created' });
  });

});


// Initial a firebase Storage
const storage = getStorage(app);

// Initial a reference to the storage service, which is used to create references in your storage bucket
const storageRef = ref(storage, 'images');
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
  const newImageData: ImageNewRequest & { score: number } = req.body;

  // get old image data
  let sql = `SELECT * FROM allstarImages WHERE id = ?`;
  const oldImageData = (await queryAsync(sql, [imageId]) as ImageNewRequest[])[0];
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