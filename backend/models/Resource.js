const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    url: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: Schema.Types.ObjectId,
        ref: 'File',
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = { Resource };
