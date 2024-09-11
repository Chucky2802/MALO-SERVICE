import express from 'express';
import cors from 'cors';
import { adminRouter } from './Routes/Admin.js';

const app = express();

const corsOptions = {
  origin: "http://localhost:3001",
 /* origin: "http://localhost:5173",*/
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/auth', adminRouter);

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
