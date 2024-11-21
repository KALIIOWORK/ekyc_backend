const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eKYCSchema = new Schema(
    {
        customerId: {
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
        DOB: {
            type: Date
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        gender: {
            type: String,
        },
        mobileNumber: {
            type: Number
        },
        aadharNumber: {
            type: Number
        },
        aadharImage: {
            type: String
        },
        pancardNumber: {
            type: String
        },
        pancardImage: {
            type: String
        },
        isekycDone: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationStatus: {
            type: String,
            default: "Pending"
        },//Pending ,Rejected ,Verified

        ekycTime: {
            type: Date,
            default: Date.now()
        },
        ekycRecording: {
            type: String
        },

    },
    {
        timestamps: true,
    }
);

const eKYC = mongoose.model("eKYC", eKYCSchema);
module.exports = eKYC;