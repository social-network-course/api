import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import userRouter from './controller/user.controller.js';
import dataRouter from "./controller/data.controller.js";
import * as DataService from './service/data.service.js';
import connectToDb from './_helpers/db.config.js';

dotenv.config();

const app = express();

// middleware
app.use(cors({ credentials: true, origin: process.env.WEBUI_URL, enablePreflight: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.options(cors())

// api routes
app.use('/users', userRouter);

await connectToDb();

// server
const PORT = process.env.HTTP_PORT;
app.listen(PORT, () => console.log('Live on ' + PORT));