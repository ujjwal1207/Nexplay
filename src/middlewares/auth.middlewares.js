const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")
const verifyjwt = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.accesstoken;
        if (!token) {
            throw new ApiError(401, "unauthorised access");
        }
const decodetoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodetoken?.id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "Invalid Access token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "INVALID ACCESS TOKEN")
    }
})
module.exports=verifyjwt;