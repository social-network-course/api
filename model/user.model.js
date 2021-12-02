import mongoose from 'mongoose';

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
    likes: {
        type: Array
    },
    watchlist: {
        type: Array
    },
    ratings: {
        type: Array
    },
    visit_time: {
        type: Array
    },
    timestamp: {
        type: Date,
        required: true,
    }
}, { collection: 'users' });

export default mongoose.model('User', userSchema);
