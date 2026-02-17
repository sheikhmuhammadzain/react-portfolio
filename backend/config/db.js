import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if we have an existing connection
    if (mongoose.connections[0].readyState) {
      console.log('MongoDB already connected');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Do not exit process in serverless environment
    // process.exit(1); 
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

export default connectDB;
