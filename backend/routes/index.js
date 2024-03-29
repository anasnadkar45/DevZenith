const express = require('express');
const userRouter = require('./user');
const resourceRouter = require('./resource')

const router = express.Router();

router.use('/user', userRouter);
router.use('/resources' , resourceRouter)

module.exports = router;