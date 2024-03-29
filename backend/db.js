const mongoose = require('mongoose');
exports.connect = () => {
    mongoose.connect('mongodb+srv://anasnadkar23:Anasnadkar45%40@cluster0.wo2o0ul.mongodb.net/DevZenithV1')
    .then(console.log("DB Connection Successful"))
    .catch(  (error) => {
        console.log("DB Connection Issues");
        console.error(error);
        process.exit(1);
    } );
};