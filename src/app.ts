import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// simple "Hello World" endpoint
app.get('/hello', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.use('/posts', postRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
