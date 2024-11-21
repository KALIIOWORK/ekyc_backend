const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {
            type: String
        },
        title: {
            type: String,
        },
        firstName: {
            type: String
        },
        middleName: {
            type: String
        },
        lastName: {
            type: String
        },
        fullName: {
            type: String
        },
        role: {
            type: String
        },//User,Verifier,Admin
        DOB: {
            type: Date
        },
        email: {
            type: String
        },
        gender: {
            type: String,
        },
        mobileNumber: {
            type: Number
        },
        password: {
            type: String
        },
        salt: {
            type: String
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;