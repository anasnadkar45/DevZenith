const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username:{
        type: String,
    },
    bio: {
        type: String,
    },
    portfolioUrl: {
        type: String,
        required: true,
    }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = { Profile }