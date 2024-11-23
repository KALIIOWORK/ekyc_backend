const express = require("express");
const router = express.Router();
const auth = require("../middlewares/Auth")

const { createNewUser } = require("../controllers/User/createNewUser")
router.post('/createNewUser', createNewUser)

//route for userLogin
const { userLogin } = require("../controllers/User/userLogin")
router.post('/userLogin', userLogin)

//route for getUserByUsername
const { getUserByUsername } = require("../controllers/User/getUserByUsername")
router.get('/getUserByUsername/:username', auth.authenticate, getUserByUsername)

//route for verifyCustomer
const { verifyCustomer } = require("../controllers/User/verifyCustomer")
router.post('/verifyCustomer', auth.authenticate, verifyCustomer)

//route for startRecording
const { startRecording } = require("../controllers/User/startRecording")
router.post('/startRecording', auth.authenticate, startRecording)

const { stopRecording } = require("../controllers/User/stopRecording")
router.post('/stopRecording', auth.authenticate, stopRecording)

module.exports = router