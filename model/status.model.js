import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const statusSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    }
}, { collection: 'statuses' });

export default mongoose.model('Status', statusSchema);
