const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
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
        verificationStatus: {
            type: String,
            default: "Pending"
        },//Pending, Approved, Rejected

        ekyc: [
            {
                type: Schema.Types.ObjectId,
                ref: 'eKYC'
            }
        ]

    },
    {
        timestamps: true,
    }
);

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;