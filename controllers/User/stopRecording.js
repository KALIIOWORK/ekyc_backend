const axios = require('axios');
const ekyc = require('../../models/ekyc');

// The API URL for stopping the recording
const stopRecordingUrl = (resourceId, sid) =>
    `https://api.agora.io/v1/apps/${process.env.APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`;

exports.stopRecording = async (req, res) => {
    try {
        const { resourceId, cname } = req.body;

        console.log(req.body);

        const uid = req.body.startRecordinguid;
        const sid = req.body.sid;

        // Step 1: Prepare the request body to stop the recording
        const stopRecordingData = {
            cname: cname,  // Channel name
            uid: uid,      // User ID
            clientRequest: {
                async_stop: false  // This means you want to wait for the API response
            }
        };

        // Step 2: Make the API call to stop the recording

        const url = stopRecordingUrl(resourceId, sid)

        const response = await axios.post(url, stopRecordingData, {
            headers: {
                Authorization: `Basic ${process.env.AGORA_ENCODED_KEY}`, // Add your encoded key here
                "Content-Type": "application/json;charset=utf-8"       // Ensure the Content-Type is set properly
            }
        });

        console.log("Stop Recording Response:", response.data);



        console.log(JSON.stringify(response.data.serverResponse.fileList));

        const fileList = response.data.serverResponse.fileList;
        console.log('File List:', JSON.stringify(fileList));

        const AWS_VIDEO_BUCKET_URL = process.env.AWS_VIDEO_BUCKET_URL;

        // Find the file with the .mp4 extension

        const mp4File = fileList.find(file => file.fileName.endsWith('.mp4'));

        if (!mp4File) {
            return res.status(400).json({
                status: false,
                message: 'No .mp4 file found in the recording'
            });
        }

        // Construct the full URL for the .mp4 file
        const mp4FileUrl = `${AWS_VIDEO_BUCKET_URL}${mp4File.fileName}`;

        // Update the document with the .mp4 file URL
        const ekycData = await ekyc.findOneAndUpdate(
            { _id: req.body.ekycId },
            {
                ekycRecording: mp4FileUrl,
                isekycDone: true, // Store only the .mp4 file URL
                isJoined: false
            },
            { new: true }
        );

        // Step 3: Check the response
        // if (response.data.code !== 0) {
        //     return res.status(400).json({
        //         status: false,
        //         message: "Failed to stop recording",
        //         error: response.data
        //     });
        // }

        // Step 4: Return success response
        res.status(200).json({
            status: true,
            message: "Recording stopped successfully",
            data: response.data
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};
