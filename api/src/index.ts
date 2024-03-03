import dotenv from 'dotenv';
import { app } from './utils/app';
import { conn } from './config/dbconnect';

//For env File
dotenv.config();

//For Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  conn.connect((err) => {
    if (err) {
      console.log('Error Connecting To The Database', err);
      return;
    }
    console.log('Connected To The Database');
  });
});
