const express = require('express');
const {Resource} = require('../db/');
const router = express.Router();

router.post('/addResource', async (req, res) => {
    const newResource = await Resource.create({
        name: req.body.name,
        url: req.body.url,
    })
    console.log(newResource)
    res.json({
        message: "Resource added successfully",
        token: token
    })
})
