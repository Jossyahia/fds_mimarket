import mongoose from "mongoose";
/*
const isConnected = {};

export const connectToDB = async () => {
  try {
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }
    const db = await mongoose.connect(process.env.MONGO);
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

*/
let isConnected = false // Track the connection

export const connectToDB = async () => {
  mongoose.set('strictQuery', true)

  if (isConnected) {
    console.log("MongoDB is connected successfully!")
    return
  }

  try {
    await mongoose.connect(process.env.MONGO)

    isConnected = true

    console.log("MongoDB connected")
  } catch (err) {
    console.log(err)
  }
}
