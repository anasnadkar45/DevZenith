const express = require('express');
const app = express();
const cors = require('cors');
const database = require('./db');
const rootRouter = require('./routes/index')
const bodyParser = require('body-parser');

//database connect
database.connect()

//middlewares
app.use(bodyParser.json());
app.use(cors());
app.use('/api/v1',rootRouter)

app.listen(3000 , () =>{
    console.log('listening on port 3000')
});