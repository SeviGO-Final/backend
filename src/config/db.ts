import mongoose from 'mongoose';
const connectToDatabase = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is undefined. Check for mongo_URI');
    }
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Connection error', error);
  }
};

export default connectToDatabase;
