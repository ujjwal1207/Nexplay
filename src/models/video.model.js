const mongoose = require('mongoose');
const mongooseaggregatePaginate = require('mongoose-aggregate-paginate-v2');
const videoSchema= new mongoose.Schema({
    videofile: {
        type: String, // cloudinary url
        required: true,
    },
    thumbnail: {
        type: String,
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title:{
        type: String,
        required: true,
        trim: true,
        index: true  
    },
    description:{
        type: String,
        required: true
    },
    duration: {
        type: Number, //cloudinary duration in seconds
        required: true
    },
    views:{
        type: Number, 
        default: 0
    },
    ispublished: {
        type: Boolean,
        default: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
},{
    timestamps: true
});
videoSchema.plugin(mongooseaggregatePaginate);
module.exports = mongoose.model('Video', videoSchema);
