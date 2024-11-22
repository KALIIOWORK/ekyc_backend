const RtcTokenBuilder = require('../../middlewares/RtcTokenBuilder2').RtcTokenBuilder
const RtcRole = require('../../middlewares/RtcTokenBuilder2').Role

// Need to set environment variable AGORA_APP_ID
const appId = process.env.APP_ID
// Need to set environment variable AGORA_APP_CERTIFICATE
const appCertificate = process.env.APP_CERTIFICATE

const channelName = '7d72365eb983485397e3e3f9d460bdda'
const uid = 2882341273
const account = '2882341273'
const role = RtcRole.PUBLISHER
const tokenExpirationInSecond = 3600
const privilegeExpirationInSecond = 3600
const joinChannelPrivilegeExpireInSeconds = 3600
const pubAudioPrivilegeExpireInSeconds = 3600
const pubVideoPrivilegeExpireInSeconds = 3600
const pubDataStreamPrivilegeExpireInSeconds = 3600



exports.generateCustomerToken = async (req, res) => {
    try {
        console.log('App Id:', appId)
        console.log('App Certificate:', appCertificate)
        if (appId == undefined || appId == '' || appCertificate == undefined || appCertificate == '') {
            console.log('Need to set environment variable AGORA_APP_ID and AGORA_APP_CERTIFICATE')
            process.exit(1)
        }


        const tokenWithUid = RtcTokenBuilder.buildTokenWithUid(
            appId,
            appCertificate,
            channelName,
            uid,
            role,
            tokenExpirationInSecond,
            privilegeExpirationInSecond
        )
        console.log('Token with int uid:', tokenWithUid)

        return res.status(200).json({
            token: tokenWithUid
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
    }
}
