const express = require('express');
const { Resource } = require('../db');
const router = express.Router();
const {authMiddleware} = require('../middleware'); // Importing authMiddleware

// add resources with authentication middleware
router.post('/addresource', authMiddleware, async (req, res) => {
    try {
        const newResource = await Resource.create({
            name: req.body.name,
            description: req.body.description,
            url: req.body.url,
        });
        if (newResource) {
            console.log(newResource);
            return res.status(200).json({
                message: "Resource added successfully",
            });
        } else {
            console.log("something went wrong");
            return res.status(500).json({
                success: false,
                message: "Failed to add resource",
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// delete a resource
// router.delete('/deleteResource/:id', async (req, res) => {
//     const resourceId = req.params.id;

//     try {
//         const deletedResource = await Resource.findByIdAndDelete(resourceId);

//         if (deletedResource) {
//             console.log("Resource deleted successfully:", deletedResource);
//             return res.status(200).json({
//                 success: true,
//                 message: "Resource deleted successfully"
//             });
//         } else {
//             console.log("Resource not found");
//             return res.status(404).json({
//                 success: false,
//                 message: "Resource not found"
//             });
//         }
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// });


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
