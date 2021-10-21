import mongoose from 'mongoose';

export const connectToDb = async () => {
    try {
        await mongoose.connect(
            process.env.DB_URI,
            {
            useNewUrlParser: true,
            useUnifiedTopology: true
            },
            () => console.log('Server connected to MongoDb!')
        );
    } catch (err) {
        console.error(err);
    }
};

export default connectToDb;