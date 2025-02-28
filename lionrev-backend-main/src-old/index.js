import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import db from './config/db.js'; // Import database connection

import { errorHandler } from './middleware/errorHandler.js';
// import { validateWebhookSignature } from './middleware/webhookAuth.js';
import leadsRouter from './routes/leads.js';
import webhookRouter from './routes/webhook.js';
import authRouter from "./routes/authRoutes.js"; 
import facebookRouter from "./routes/facebook.js"; 





dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('error connecting:', err);
    return;
  }
  console.log('successfully connected db');
});

// Basic security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/facebook", facebookRouter);

app.use('/api/leads', leadsRouter);
// app.use('/api/webhook', validateWebhookSignature, webhookRouter);
app.use('/webhook', webhookRouter);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});