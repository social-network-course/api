import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const topRatedMovieSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    adult: {

    },
    backdrop_path: {

    },
    belongs_to_collection: {

    },
    budget: {

    },
    homepage: {

    },
    imdb_id: {

    },
    original_language: {

    },
    original_title: {

    },
    overview: {

    },
    popularity: {

    },
    poster_path: {

    },
    release_date: {

    },
    revenue: {

    },
    runtime: {

    },
    status: {

    },
    tagline: {

    },
    title: {

    },
    video: {

    },
    vote_average: {

    },
    vote_count: {

    },
    timestamp: {
        type: Date,
        required: true,
    }
}, { collection: 'top-rated-movies' });

export default mongoose.model('TopRated', topRatedMovieSchema);
