const mongoose = require("mongoose");

async function databaseConnect() {
  try {
    await mongoose.connect(process.env.MONGODB_KEY);
    console.log("Successfully connected to mongoDB!");
  } catch (err) {
    console.log("Cannot connect with mongoDB :(");
    console.log(err);
  }
}

export const state = mongoose.connection.readyState;

export default databaseConnect; //establishes connection with database before app is rendered
