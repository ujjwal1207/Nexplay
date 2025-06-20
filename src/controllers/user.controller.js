const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const User = require('../models/user.model');
const { uploadoncloudinary } = require('../utils/cloudinary');
const { ApiResponse } = require('../utils/ApiResponse');

const generateAccessAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID);
        const accesstoken = user.generateAccessToken();
        const refreshtoken = user.generateRefreshToken();

        user.refreshToken = refreshtoken;
        await user.save({ validateBeforeSave: false });

        return {
            accesstoken, refreshtoken
        }
    } catch (error) {
        throw new ApiError(500, "Something went wrong with acces and refresh tokens controller", error)
    }
}

const registereduser = asyncHandler(async (req, res) => {
    // Here you would typically save the user to the database
    // For demonstration, we will just return the user data
    console.log("User registration data:");


    //user ki details frontend se receive hogi
    //not empty ke liye validation karna padega
    //check if user already exists
    //check for images and avatar
    //images ko upload karna padega
    //user object create karke database me save karna padega
    //password ko hash karna padega
    //token generate karna padega
    //cookie me token set karna padega
    // flash message set karna padega
    //check is user registered successfully
    //return user
    const { fullname, email, username, password } = req.body;
    if (!fullname || !email || !username || !password) {
        throw new ApiError(400, "All fields are required");
    }
    const existinguser = await User.findOne({
        $or: [
            { email: email },
            { username: username }
        ]
    })
    if (existinguser) {
        throw new ApiError(409, "User already exists with this email or username");
    }
    const avatarfile = req.files?.avatar[0]?.path;
    const coverimagefile = req.files?.coverimage[0]?.path;
    if (!avatarfile) {
        throw new ApiError(400, "Avatar are required");
    }
    console.log("avatar file path: and coverimage path", avatarfile, coverimagefile);
    const avatar = await uploadoncloudinary(avatarfile);
    const coverimage = await uploadoncloudinary(coverimagefile);

    if (!avatar || !coverimage) {
        throw new ApiError(500, "Error uploading images to cloud");
    }
    const user = await User.create({
        fullname,
        email,
        username,
        password,
        avatar: avatar.url,
        coverimage: coverimage?.url || ""
    });
    if (!user) {
        throw new ApiError(500, "User registration failed");
    }
    //yahan user mein se password aur refrsh token ko hata dena chahiye
    // hence create a created user object without password and refresh token
    return res.status(201).json(
        new ApiResponse(200, user, "User registered successfully")
    )


});

const loginuser = asyncHandler(async (req, res) => {
    //req body se data  uthao
    if (!req.body) {
    throw new ApiError(400, "Missing request body");
}

    const { email, username, password, } = req.body;
    if ((!username && !email) || !password) {
    throw new ApiError(400, "Email or Username and Password are required");
}

    //checking if user exists
    const user = await User.findOne({
  $or: [{ email }, { username }]
});
    if (!user) {
        throw new ApiError(404, "USER NOT FOUND");
    }

    //checking password
    const ispasswordcorrect = await user.ispasswordcorrect(password);
    if (!ispasswordcorrect) {
        throw new ApiError(401, "INVALID CREDENTIALS");
    }

    //access and refresh token
    const { accesstoken, refreshtoken } = await generateAccessAndRefreshToken(user._id);

    const loggedinuser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200).cookie("accesstoken", accesstoken, options).cookie("refreshtoken", refreshtoken, options).json(new ApiResponse(200,
        { user: loggedinuser, accesstoken, refreshtoken },
        "User loggedin successfully"
    ))

})

const logoutuser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },{
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200).clearCookie("accesstoken", options).clearCookie("refreshtoken", options).json(
        new ApiResponse(200, {}, "user logged out successfully")
    )
})


//     module.exports.registeredUser= async (req, res) => {
//     try {
//         let { name, email, password} = req.body;
//         console.log('Request Body:', req.body);
//         bcrypt.genSalt(10, async function (err, salt) {
//             bcrypt.hash(password, salt, async function (err, hash) {
//                 if (err) {
//                     console.log(err);
//                     res.status(500).send('password hashing error')
//                 } else {
//                     let createduser = await userModel.create({
//                         name,
//                         email,
//                         password:hash,
//                     }) 
//                     let token=generateToken(createduser);
//                     res.cookie('token', token);
//                     req.flash('success','Registered successfully')
//                     res.redirect('/shop');
//                 }
//             })
//         })
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Internal Server Error')
//     }
// }
module.exports = {
    registereduser,
    loginuser,
    logoutuser
};