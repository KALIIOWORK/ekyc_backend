const axios = require('axios');
const eKYC = require('../../models/ekyc');
const User = require('../../models/User');

// The API URL for acquiring the recording resource
const acquireUrl = `https://api.agora.io/v1/apps/${process.env.APP_ID}/cloud_recording/acquire`;

// The API URL for starting the recording
const startRecordingUrl = (resourceId) =>
    `https://api.agora.io/v1/apps/${process.env.APP_ID}/cloud_recording/resourceid/${resourceId}/mode/mix/start`;

exports.startRecording = async (req, res) => {
    try {
        console.log(req.body)
        console.log(acquireUrl)

        //uid is passed as a string
        //cname is passed as a string
        //token is passed as a string

        const uid = req.body.startRecordinguid;
        console.log("startRecordinguid", uid)
        const customeruid = parseInt(req.body.customeruid, 10);
        if (isNaN(customeruid) || customeruid < 0 || customeruid > 4294967295) {
            throw new Error('Invalid customeruid. It must be a valid 32-bit unsigned integer.');
        }
        // Step 1: Acquire a recording resource

        const body = {
            cname: req.body.cname, // Channel name
            uid: uid,     // User ID
            clientRequest: {
                resourceExpiredHour: 24, // Resource valid for 24 hours
                scene: 0                // Default scene for recording
            }
        }
        console.log(body)
        const acquireResponse = await axios.post(
            acquireUrl, // The API endpoint
            {
                cname: req.body.cname, // Channel name
                uid: uid,     // User ID
                clientRequest: {
                    resourceExpiredHour: 24, // Resource valid for 24 hours
                    scene: 0                // Default scene for recording
                }
            },
            {
                headers: {
                    Authorization: `Basic ${process.env.AGORA_ENCODED_KEY}`, // Add your encoded key here
                    "Content-Type": "application/json;charset=utf-8"       // Ensure the Content-Type is set properly
                }
            }
        );

        //console.log("Acquire Response:", acquireResponse.data);

        // Step 2: Check if resource acquisition is successful
        // if (acquireResponse.data.code !== 0) {
        //     return res.status(400).json({
        //         status: false,
        //         message: "Failed to acquire resource",
        //         error: acquireResponse.data
        //     });
        // }

        // Get the resource ID from the acquisition response
        const resourceId = acquireResponse.data.resourceId;

        const startUrl = startRecordingUrl(resourceId);

        console.log(startUrl)

        const startBody = {

            cname: req.body.cname,
            uid: uid,
            clientRequest: {
                token: req.body.startRecordingtoken,
                recordingConfig: {
                    channelType: 1,
                    streamTypes: 2,
                    streamMode: "default",
                    videoStreamType: 0,
                    maxIdleTime: 200,
                    subscribeAudioUids: ["#allstream#"],
                    subscribeVideoUids: ["#allstream#"],
                    subscribeUidGroup: 0
                },
                recordingFileConfig: {
                    avFileType: ["hls", "mp4"]
                },
                storageConfig: {
                    vendor: 1,
                    region: 14, // Region for India
                    bucket: process.env.AWS_VIDEO_BUCKET_NAME,
                    accessKey: process.env.AWS_VIDEO_BUCKET_ACCESS_KEY_ID,
                    secretKey: process.env.AWS_VIDEO_BUCKET_SECRET_ACCESS_KEY,
                    fileNamePrefix: [`${req.body.ekycId}`]
                }
            }
        }
        console.log(JSON.stringify(startBody));

        const startResponseBody = JSON.stringify(startBody)

        // Step 3: Start recording with the acquired resource ID
        const startResponse = await axios.post(startUrl, startResponseBody,
            {
                headers: {
                    Authorization: `Basic ${process.env.AGORA_ENCODED_KEY}`, // Add your encoded key here
                    "Content-Type": "application/json"       // Ensure the Content-Type is set properly
                }
            });

        // Step 4: Check if the recording started successfully
        // if (startResponse.data.code !== 0) {
        //     return res.status(400).json({
        //         status: false,
        //         message: "Failed to start recording",
        //         error: startResponse.data
        //     });
        // }

        // Step 5: Return a success response

        const agent = await User.findOne({ username: req.body.agentUsername });
        console.log("agent", agent)

        const updateeKYC = await eKYC.findOneAndUpdate(
            { _id: req.body.ekycId },
            { agentName: agent.fullName },
            { new: true }
        );
        console.log("updateeKYC", updateeKYC);

        console.log("sid", startResponse.data.sid)
        res.status(200).json({
            status: true,
            message: "Recording started successfully",
            data: startResponse.data,
            sid: startResponse.data.sid,
            resourceId: resourceId
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};
