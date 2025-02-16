import mongoose from "mongoose";

export const CONNECT_DB= async(uri)=>{
    try {
        await mongoose.connect(uri);
        console.log(`Connection Db`);
    } catch (error) {
        console.log(`Error: ${error}`);
    };
};
