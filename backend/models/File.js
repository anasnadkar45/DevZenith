const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true,
    },
    imageUrl: {
        type: 'string',
    }
});

const File = mongoose.model('File', fileSchema);

module.exports = {File}