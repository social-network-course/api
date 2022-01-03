import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const movieSchema = new Schema({
    adult: {
        type: Boolean
    },
    backdrop_path: {
        type: String,
        default: null
    },
    belongs_to_collection: {
        type: Object,
        default: null
    },
    budget: {
        type: Number,
        default: null
    },
    cast: {
        type: Array
    },
    genres: {
        type: Array
    },
    homepage: {
        type: Array
    },
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    imdb_id: {
        type: String
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
    production_companies: {
        type: Array
    },
    production_countries: {
        type: Array
    },
    release_date: {
        type: String
    },
    revenue: {
        type: Number
    },
    runtime: {
        type: Number
    },
    spoken_languages: {
        type: Array
    },
    social_ratings: {
        type: Array
    },
    status: {
        type: String
    },
    tagline: {
        type: String
    },
    title: {
        type: String
    },
    video: {
        type: Boolean
    },
    videos: {
        type: Object
    },
    visit_counter: {
        type: Number,
        default: 0
    },
    vote_average: {
        type: Number
    },
    vote_count: {
        type: Number
    }
}, { collection: 'movies' });

export default mongoose.model('Movie', movieSchema);
