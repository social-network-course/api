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
    visit_times: {
        type: Array
    },
    timestamp: {
        type: Date,
        default: () => moment().utc(true)
    }
}, { collection: 'users' });

export default mongoose.model('User', userSchema);
