import mongoose from 'mongoose';

import { movieSchema } from "./movie.model.js";

const Schema = mongoose.Schema;

const popularMovieSchema = new Schema({
    ...movieSchema.obj
}, { collection: 'popular-movies' });

export default mongoose.model('PopularMovie', popularMovieSchema);
