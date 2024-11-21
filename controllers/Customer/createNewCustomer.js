const Customer = require("../../models/Customer")
const Counter = require("../../models/Counter");
const eKYC = require("../../models/ekyc")
const FileUpload = require('../Utils/AwsSingleUpload');

exports.createNewCustomer = async (req, res) => {
    try {
        if (!req.files) {
            throw new Error("Please upload Images");
        }

        const customerexists = await Customer.findOne({ aadharNumber: req.body.aadharNumber })

        if (!customerexists) {
            const newCustomer = new Customer(req.body);
            let counter = await Counter.findOneAndUpdate({ identifierName: "Customer" }, { $inc: { count: 1 } }, { upsert: true, new: true });


            newCustomer.customerId = "CUST-" + counter.count

            let fullName = req.body.firstName
            if (req.body.middleName) fullName = fullName + " " + req.body.middleName;
            fullName = fullName + " " + req.body.lastName

            newCustomer.fullName = fullName;

            let doc = await newCustomer.save();

            if (!doc) {
                throw new Error("Unable to add Customer")
            }
            // else {
            //     return res.status(200).json({
            //         status: true,
            //         message: "New Customer Added Successfully",
            //         User: doc
            //     })
            // }
        }
        let currentCustomer = await Customer.findOne({ aadharNumber: req.body.aadharNumber })

        const newEKYC = new eKYC(req.body);

        const aadharImage = req.files['aadharImage'][0];
        const pancardImage = req.files['pancardImage'][0];


        const aadharFileName = `AadharImages/${currentCustomer.customerId}/${Date.now()}-${aadharImage.originalname}`;
        const pancardFileName = `PancardImages/${currentCustomer.customerId}/${Date.now()}-${pancardImage.originalname}`;

        const aadharUrl = await FileUpload.upload(aadharImage.buffer, aadharFileName);
        const pancardUrl = await FileUpload.upload(pancardImage.buffer, pancardFileName);

        newEKYC.fullName = currentCustomer.fullName;
        newEKYC.aadharImage = aadharUrl;
        newEKYC.pancardImage = pancardUrl;



        let doc = await newEKYC.save();

        if (!doc) {
            throw new Error("Error in creating new eKYC");
        }

        let updateCustomer = await Customer.findOneAndUpdate({ aadharNumber: req.body.aadharNumber }, { $push: { ekyc: doc } }, { new: true })

        if (!updateCustomer) {
            throw new Error("Error in updating customer with new eKYC");
        }

        return res.status(200).json({
            status: true,
            message: "eKYC document created successfully",
            Customer: updateCustomer,
            eKYCId: doc._id
        });

    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}
