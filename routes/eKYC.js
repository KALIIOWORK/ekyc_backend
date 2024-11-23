const express = require("express");
const router = express.Router();
const auth = require("../middlewares/Auth")

// const { createNeweKYC } = require("../controllers/eKYC/createNeweKYC")
// router.post('/createNeweKYC', upload.fields([{ name: 'aadharImage' }, { name: 'pancardImage' }]), createNeweKYC)


//route for geListOfeKYC
const { getListOfeKYC } = require("../controllers/eKYC/getListOfeKYC")
router.get('/getListOfeKYC', auth.authenticate, getListOfeKYC)

//route for geteKYCById
const { geteKYCById } = require("../controllers/eKYC/getekycById")
router.get('/geteKYCById/:id', auth.authenticate, geteKYCById)

module.exports = router