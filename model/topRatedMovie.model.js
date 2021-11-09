import mongoose from 'mongoose';

import { movieSchema } from "./movie.model.js";

const Schema = mongoose.Schema;

const topRatedMovieSchema = new Schema({
    ...movieSchema.obj
}, { collection: 'top-rated-movies' });

export default mongoose.model('TopRatedMovie', topRatedMovieSchema);
