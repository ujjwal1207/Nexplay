const express = require('express');
const { registereduser, loginuser, logoutuser, refreshAccessToken, getCurrentUser, updateAccountDetails, changeCurrentPassword, updateUserAvatar, updateCoverimage } = require('../controllers/user.controller');
const upload= require('../middlewares/multer.middleware');
const verifyjwt = require('../middlewares/auth.middlewares');
const router=express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.post("/register", upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverimage', maxCount: 1 }
]),registereduser)

router.post("/login",loginuser)

router.post("/logout",verifyjwt, logoutuser)

router.post("/resfreshtoken",refreshAccessToken )

router.post("/getuser", getCurrentUser)

router.post("/changepassword", changeCurrentPassword)

router.post("/update", updateAccountDetails)

router.post("/updateavatar", updateUserAvatar)

router.post("/updatecoverimage", updateCoverimage)


module.exports= router;