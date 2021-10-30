import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const recommendedMovieSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    adult: {
        type: Boolean
    },
    backdrop_path: {
        type: String,
        default: null
    },
    genre_ids: {
        type: Array
    },
    original_language: {
        type: String
    },
    original_title: {
        type: String
    },
    overview: {
        type: String
    },
    popularity: {
        type: Number
    },
    poster_path: {
        type: String,
        default: null
    },
    release_date: {
        type: String
    },
    title: {
        type: String
    },
    video: {
        type: Boolean
    },
    vote_average: {
        type: Number
    },
    vote_count: {
        type: Number
    }
}, { collection: 'recommended-movies' });

export default mongoose.model('RecommendedMovie', recommendedMovieSchema);
