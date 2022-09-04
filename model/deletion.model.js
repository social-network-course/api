import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const deletionSchema = new Schema(
  {
    confirmation_code: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { collection: 'deletions' }
);

export default mongoose.model('Deletion', deletionSchema);
