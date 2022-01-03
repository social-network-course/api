import mongoose from 'mongoose';
import moment from "moment";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    pictureUrl: {
        type: String,
        required: true,
    },
    location: {
        type: Object
    },
    favourite_genres: {
        type: Array
    },
    likes: {
        type: Array
    },
    watchlist: {
        type: Array
    },
    ratings: {
        type: Array
    },
    genre_ratings: {
        type: Object,
        default: {
            ratings: [
                {
                    genreId: 35,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 12,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 10749,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 16,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 28,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 36,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 99,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 80,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 18,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 878,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 10402,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 14,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 9648,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 27,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 10770,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 10751,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 10752,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 53,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                },
                {
                    genreId: 37,
                    avgRating: 0,
                    sumOfRatings: 0,
                    totalNumberOfRatings: 0
                }
            ],
            avgRatingAggregate: {
                avgRating: 0,
                sumOfRatings: 0,
                totalNumberOfRatings: 0
            }
        }
    },
    visit_times: {
        type: Array
    },
    timestamp: {
        type: Date,
        default: () => moment().utc(true)
    }
}, { collection: 'users' });

export default mongoose.model('User', userSchema);
