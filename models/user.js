import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type: String,
        min: 3,
        max: 255,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified : {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model("user", userSchema);

export default User