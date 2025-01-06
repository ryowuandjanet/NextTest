import mongoose from 'mongoose';

// Define interface for global mongoose type
interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global mongoose variable with interface
declare global {
  var mongoose: GlobalMongoose;
}

// Initialize cached connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Missing MONGODB_URI');
    }

    // Return existing connection if available
    if (cached.conn) {
      return cached.conn;
    }

    // Create new connection if none exists
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      // Fix type error by explicitly typing the promise
      cached.promise = mongoose
        .connect(process.env.MONGODB_URI!, opts)
        .then((mongoose): typeof mongoose => mongoose);
    }

    // Await connection and cache it
    const conn = await cached.promise;
    cached.conn = conn;
    return conn;
  } catch (error) {
    throw new Error(`MongoDB 連接錯誤: ${error}`);
  }
}
