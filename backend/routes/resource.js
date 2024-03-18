// Import necessary modules
const express = require('express');
const { Resource, User } = require('../db');
const zod = require('zod');
const router = express.Router();
const { authMiddleware } = require('../middleware');

// Define resource schema for validation
const resourceBody = zod.object({
    name: zod.string(),
    description: zod.string(),
    url: zod.string().url()
});

// Route to add a new resource for the authenticated user
router.post('/addresource', authMiddleware, async (req, res) => {
    try {
        // Validate request body
        const { success, data } = resourceBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: 'Invalid resource data' });
        }

        // Create new resource with creator ID
        const newResource = await Resource.create({
            ...data,
            creator: req.userId
        });

        // Find the user by ID and update the resources array
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.resources.push(newResource); // Add the new resource to the resources array

        // Save the updated user document
        await user.save();

        // Return success response
        return res.status(200).json({
            message: 'Resource added successfully',
            resource: newResource
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to add resource' });
    }
});


// Route to fetch resources of the authenticated user
router.get('/user-resources', authMiddleware, async (req, res) => {
    try {
        // Fetch resources where creator ID matches authenticated user ID
        const userResources = await Resource.find({ creator: req.userId });

        // Send the resources as a JSON response
        res.json(userResources);
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: err.message });
    }
});


// get all resources
router.get('/resourcesList', async (req, res) => {
    try {
        const resources = await Resource.find(); // Retrieve all resources from the database
        res.json(resources); // Send the resources as a JSON response
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle errors
    }
})



module.exports = router;
