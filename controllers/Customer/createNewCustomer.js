const Customer = require("../../models/Customer")
const Counter = require("../../models/Counter");
const eKYC = require("../../models/ekyc")
const FileUpload = require('../Utils/AwsSingleUpload');
const RtcTokenBuilder = require('../../middlewares/RtcTokenBuilder2').RtcTokenBuilder
const RtcRole = require('../../middlewares/RtcTokenBuilder2').Role
const random = require('random-string-alphanumeric-generator');
const crypto = require('crypto');

// Need to set environment variable AGORA_APP_ID
const appId = process.env.APP_ID
// Need to set environment variable AGORA_APP_CERTIFICATE
const appCertificate = process.env.APP_CERTIFICATE
const role = RtcRole.PUBLISHER
const tokenExpirationInSecond = 3600
const privilegeExpirationInSecond = 3600
const joinChannelPrivilegeExpireInSeconds = 3600
const pubAudioPrivilegeExpireInSeconds = 3600
const pubVideoPrivilegeExpireInSeconds = 3600
const pubDataStreamPrivilegeExpireInSeconds = 3600

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

        const uid = Math.floor(10000000 + Math.random() * 90000000).toString();
        const agentUID = Math.floor(10000000 + Math.random() * 90000000).toString();
        const startRecordinguid = Math.floor(10000 + Math.random() * 90000).toString(); // Generate a 5-digit number


        console.log('UID:', uid);
        const channelName = `ekyc-${uid}`

        console.log('App Id:', appId)
        console.log('App Certificate:', appCertificate)
        if (appId == undefined || appId == '' || appCertificate == undefined || appCertificate == '') {
            console.log('Need to set environment variable AGORA_APP_ID and AGORA_APP_CERTIFICATE')
            process.exit(1)
        }

        const agenttoken = RtcTokenBuilder.buildTokenWithUidAndPrivilege(
            appId,
            appCertificate,
            channelName,
            agentUID,
            tokenExpirationInSecond,
            joinChannelPrivilegeExpireInSeconds,
            pubAudioPrivilegeExpireInSeconds,
            pubVideoPrivilegeExpireInSeconds,
            pubDataStreamPrivilegeExpireInSeconds
        )
        console.log('Agent Token:', agenttoken)


        const tokenWithUidAndPrivilege = RtcTokenBuilder.buildTokenWithUidAndPrivilege(
            appId,
            appCertificate,
            channelName,
            uid,
            tokenExpirationInSecond,
            joinChannelPrivilegeExpireInSeconds,
            pubAudioPrivilegeExpireInSeconds,
            pubVideoPrivilegeExpireInSeconds,
            pubDataStreamPrivilegeExpireInSeconds
        )
        console.log('Token with int uid and privilege:', tokenWithUidAndPrivilege)

        const startRecordingtoken = RtcTokenBuilder.buildTokenWithUidAndPrivilege(
            appId,
            appCertificate,
            channelName,
            startRecordinguid,
            tokenExpirationInSecond,
            joinChannelPrivilegeExpireInSeconds,
            pubAudioPrivilegeExpireInSeconds,
            pubVideoPrivilegeExpireInSeconds,
            pubDataStreamPrivilegeExpireInSeconds
        )

        console.log('Start Recording Token:', startRecordingtoken)

        newEKYC.channelName = channelName;
        newEKYC.agentuid = agentUID;
        newEKYC.agenttoken = agenttoken
        newEKYC.startRecordinguid = startRecordinguid;
        newEKYC.startRecordingtoken = startRecordingtoken;
        newEKYC.customeruid = uid;
        newEKYC.customerToken = tokenWithUidAndPrivilege;

        let doc = await newEKYC.save();

        if (!doc) {
            throw new Error("Error in creating new eKYC");
        }

        let updateCustomer = await Customer.findOneAndUpdate({ aadharNumber: req.body.aadharNumber }, { $push: { ekyc: doc } }, { new: true })

        if (!updateCustomer) {
            throw new Error("Error in updating customer with new eKYC");
        }

        //generate only 12 digit random number


        return res.status(200).json({
            status: true,
            message: "eKYC document created successfully",
            Customer: updateCustomer,
            eKYCId: doc._id,
            channelName: channelName,
            token: tokenWithUidAndPrivilege,
            uid: uid
        });

    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}
