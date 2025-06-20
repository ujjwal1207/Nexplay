const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    avatar: {
        type: String,//cloudinary url
        required: true,
    },
    coverimage: {
        type: String,//cloudinary url
    },
    watchHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'video'
    }],
    refreshToken: {
        type: String
    }
},
    { timestamps: true }
);


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.generateAccessToken = function () {
    const token = jwt.sign({
        id: this._id,
        username: this.username,
        email: this.email,
        fullname: this.fullname},
        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        });
    return token;
};
userSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign({
        id: this._id},
        process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        });
    return token;
};
userSchema.methods.ispasswordcorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("user", userSchema);
module.exports = User;