const express = require('express');
const userRouter = require('../routes/user');
const resourceRouter = require('../routes/resource')

const router = express.Router();

router.use('/user', userRouter);
router.use('/resources' , resourceRouter)

module.exports = router;