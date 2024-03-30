const express = require('express');
const app = express();

require('dotenv').config();
const cors = require('cors');
const rootRouter = require('./routes/index')
const bodyParser = require('body-parser');


app.use(express.json());
const fileupload = require('express-fileupload');
app.use(fileupload({
    useTempFiles: true,
    tempFileDir:'/tmp/'
}));


//database connect
const database = require('./config/db');
database.connect()

// cloudinary connection
const cloudinary = require('./config/cloudinary');
cloudinary.cloudinaryConnect();

//middlewares
app.use(bodyParser.json());
app.use(cors());
app.use('/api/v1',rootRouter)

app.listen(3000 , () =>{
    console.log('listening on port 3000')
});