import mongoose from "mongoose";
import dotenv from "dotenv";

const databaseConnect = async () => {
  dotenv.config();
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/octagon';

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log("Error while connecting to database",error);
  }
}

export default databaseConnect;

