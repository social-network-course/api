import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const genreSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    }
}, { collection: 'genres' });

export default mongoose.model('Genre', genreSchema);
