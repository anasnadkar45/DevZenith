const express = require('express');
const { Resource } = require('../db');
const router = express.Router();

router.post('/addresource', async (req, res) => {
    try {
        const newResource = await Resource.create({
            name: req.body.name,
            url: req.body.url,
        })
        if (newResource) {
            console.log(newResource)
        } else {
            console.log("something went wrong")
        }
        return res.status(200).json({
            message: "Resource added successfully",
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

router.get('/resourcesList', async (req, res) => {
    try {
        const resources = await Resource.find(); // Retrieve all resources from the database
        res.json(resources); // Send the resources as a JSON response
      } catch (err) {
        res.status(500).json({ message: err.message }); // Handle errors
      }
})

module.exports = router;
