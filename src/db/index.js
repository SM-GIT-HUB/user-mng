import mongoose from "mongoose"

let isConnected = false;

async function dbConnect()
{
    if (isConnected) {
        return;
    }

    try {
        const url = process.env.MONGO_URL || "mongodb://localhost:27017/nextapp";
        await mongoose.connect(url);

        console.log("db connection successful");
        isConnected = true;
    }
    catch(err) {
        console.log("error in dbConnect", err.message);
    }
}

export default dbConnect