import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import userRouter from './controller/user.controller.js';
import movieRouter from "./controller/movie.controller.js";
import connectToDb from './_helpers/db.config.js';
import { fetchRecommendedMoviesData, fetchTopRatedMoviesData } from "./client/movie.client.js";
import { checkFbTokenExpiration } from "./util/communication.js";

dotenv.config();

const app = express();

// middleware
app.use(cors({ credentials: true, origin: process.env.WEBUI_URL, preflight: true } ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// check fb token expiration
app.use(checkFbTokenExpiration)

// api routes
app.use('/users', userRouter);
app.use('/movies', movieRouter);

await connectToDb();

/*await fetchRecommendedMoviesData();
await fetchTopRatedMoviesData();*/

// server
const PORT = process.env.HTTP_PORT;
app.listen(PORT, () => console.log('Live on ' + PORT));