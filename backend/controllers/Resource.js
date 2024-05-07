const { Resource } = require('../models/Resource');
const { User } = require('../models/User');
const zod = require('zod');

// Define resource schema for validation
const resourceBody = zod.object({
    name: zod.string(),
    description: zod.string(),
    url: zod.string().url()
});

// Route to add a new resource for the authenticated user
exports.addResource = async (req, res) => {
    try {
        const { success, data } = resourceBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: 'Invalid resource data' });
        }

        const newResource = await Resource.create({
            ...data,
            creator: req.userId
        });

        return res.status(200).json({
            message: 'Resource added successfully',
            resource: newResource
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to add resource' });
    }
};

exports.saveResource = async (req, res) => {
    try {
        const { resourceId } = req.body;

        const resource = await Resource.findById(resourceId);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the resource is already saved by the user
        if (user.savedResources.includes(resourceId)) {
            return res.status(400).json({ message: 'Resource already saved' });
        }

        // Save the resource to the user's profile
        user.savedResources.push(resourceId);
        await user.save();

        return res.status(200).json({
            message: 'Resource saved successfully'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to save resource' });
    }
};

exports.getSavedResources = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('savedResources');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract saved resources from the user object
        const savedResources = user.savedResources;

        return res.status(200).json({
            message: 'Saved resources fetched successfully',
            savedResources
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch saved resources' });
    }
};
// Route to delete the resource
exports.deleteResource = async (req, res) => {
    try {
        const deleteResource = await Resource.findByIdAndDelete(req.params.id);
        if (!deleteResource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Resource deleted successfully'
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.editResource = async (req, res) => {
    try {
        const { success, data } = resourceBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: 'Invalid resource data' });
        }

        const updatedResource = await Resource.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!updatedResource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Resource updated successfully',
            data: updatedResource
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to update resource' });
    }
};

// Route to get all resources
exports.resourcesList = async (req, res) => {
    try {
        const resources = await Resource.find(); // Retrieve all resources from the database
        res.json(resources); // Send the resources as a JSON response
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle errors
    }
};
