import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

// Connect/disconnect helpers so the bootstrap (server.js) and tests can manage
// the Mongoose connection lifecycle explicitly. The app factory never connects.
export async function connectDB(uri) {
  if (!uri) {
    throw new Error('connectDB requires a MongoDB connection string');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  logger.info('MongoDB connected');
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

export default { connectDB, disconnectDB };
