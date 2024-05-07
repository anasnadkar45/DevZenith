// Import necessary modules
const express = require('express');
const router = express.Router();
const { resourcesList, addResource, deleteResource, saveResource, getSavedResources,editResource } = require('../controllers/Resource');
const { authMiddleware } = require('../middleware');

// Route for user resource 
router.post("/addresource", authMiddleware, addResource);
router.post("/saveresource", authMiddleware, saveResource);
router.get('/savedresources', authMiddleware, getSavedResources);
router.delete('/delete-resource/:id' , authMiddleware, deleteResource);
router.put('/edit-resources/:id',authMiddleware, editResource);
router.get('/resourcesList', authMiddleware ,resourcesList);

module.exports = router;
