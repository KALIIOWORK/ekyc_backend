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
        aadharFrontImage: {
            type: String
        },
        aadharBackImage: {
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

        verificationComments: {
            type: String
        },

        ekycTime: {
            type: Date,
            default: Date.now()
        },
        ekycRecording: {
            type: String
        },
        customerPhoto: {
            type: String
        },
        agentuid: {
            type: Number
        },
        channelName: {
            type: String
        },
        agenttoken: {
            type: String
        },
        startRecordinguid: {
            type: Number
        },
        startRecordingtoken: {
            type: String
        },
        customeruid: {
            type: Number
        },
        customertoken: {
            type: String
        },
        agentName: {
            type: String,
            default: "Not Assigned"
        },
        isJoined: {
            type: Boolean,
            default: false
        },
        isMissed: {
            type: Boolean,
            default: false
        },
        missedTime: {
            type: Date
        },

    },
    {
        timestamps: true,
    }
);

const eKYC = mongoose.model("eKYC", eKYCSchema);
module.exports = eKYC;