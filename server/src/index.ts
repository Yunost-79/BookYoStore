import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import ansiColors from 'ansi-colors';

import connectToMongoDB from './db/connectToDb';

import authRoutes from './routes/auth.route';
import bookRoutes from './routes/book.route';
import purchaseRoutes from './routes/purchase.route';

dotenv.config();
const PORT = (process.env.PORT as string) || 7000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/purchase', purchaseRoutes);

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(ansiColors.blue(`Server running on port: ${PORT}`));
});
