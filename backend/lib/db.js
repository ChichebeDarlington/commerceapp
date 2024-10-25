import mongoose from "mongoose";

export const databaseConnect = async (uri) => {
  try {
    const conne = await mongoose.connect(uri);
    // console.log(`mongoDb connected: ${conne.connected.host}`);
    console.log(`mongoDb connected:`);
  } catch (error) {
    console.log("Error while connecting to the database", error.message);
    process.exit(1);
  } finally {
    console.log("Finally!!!");
    // process.exit(0);
  }
};
