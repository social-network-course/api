import mongoose from 'mongoose';

import { movieSchema } from "./movie.model.js";

const Schema = mongoose.Schema;

const recommendedMovieSchema = new Schema({
    ...movieSchema.obj
}, { collection: 'recommended-movies' });

export default mongoose.model('RecommendedMovie', recommendedMovieSchema);
