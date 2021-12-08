import express from 'express';

import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import prerender from 'prerender-node';

import userRouter from './controller/user.controller.js';
import movieRouter from "./controller/movie.controller.js";
import connectToDb from './_helpers/db.config.js';
import { fetchMoviesAndGenres } from "./client/movie.client.js";
import { authMiddleware } from "./util/communication.js";
import { setStatuses } from "./util/db.js";

dotenv.config();

const app = express();

// middleware
app.use(cors({ credentials: true, origin: process.env.WEBUI_URL, preflight: true } ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(prerender);

// api routes
app.use('/users', authMiddleware, userRouter);
app.use('/movies', movieRouter);

await connectToDb();

/*await fetchMoviesAndGenres();*/

/*setStatuses();*/

// server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log('Live on ' + PORT));