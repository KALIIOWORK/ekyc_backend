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


        const pancardImage = req.files['pancardImage'][0];
        const aadharFrontImage = req.files['aadharFrontImage'][0];
        const aadharBackImage = req.files['aadharBackImage'][0];
        const customerPhoto = req.files['customerPhoto'][0];


        const aadharFileName = `AadharFrontImages/${currentCustomer.customerId}/${Date.now()}-${aadharFrontImage.originalname}`;
        const aadharBackFileName = `AadharBackImages/${currentCustomer.customerId}/${Date.now()}-${aadharBackImage.originalname}`;
        const pancardFileName = `PancardImages/${currentCustomer.customerId}/${Date.now()}-${pancardImage.originalname}`;
        const customerPhotoFileName = `CustomerPhotos/${currentCustomer.customerId}/${Date.now()}-${customerPhoto.originalname}`;

        const aadharFrontUrl = await FileUpload.upload(aadharFrontImage.buffer, aadharFileName);
        const aadharBackUrl = await FileUpload.upload(aadharBackImage.buffer, aadharBackFileName);
        const pancardUrl = await FileUpload.upload(pancardImage.buffer, pancardFileName);
        const customerPhotoUrl = await FileUpload.upload(customerPhoto.buffer, customerPhotoFileName);

        newEKYC.fullName = currentCustomer.fullName;
        newEKYC.aadharFrontImage = aadharFrontUrl;
        newEKYC.aadharBackImage = aadharBackUrl;
        newEKYC.pancardImage = pancardUrl;
        newEKYC.customerPhoto = customerPhotoUrl;



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
