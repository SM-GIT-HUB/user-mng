import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    address: String
})

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel