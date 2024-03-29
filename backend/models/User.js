const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    resources: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Resource',
        }
    ],
    profile:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Profile',
        }
    ]
})

const User = mongoose.model('User', userSchema);
module.exports = { User }