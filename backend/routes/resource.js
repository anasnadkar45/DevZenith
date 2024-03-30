// Import necessary modules
const express = require('express');
const router = express.Router();
const { resourcesList, addResource, deleteResource, saveResource, getSavedResources } = require('../controllers/Resource');
const { authMiddleware } = require('../middleware');

// Route for user resource 
router.post("/addresource", authMiddleware, addResource);
router.post("/saveresource", authMiddleware, saveResource);
router.get('/savedresources', authMiddleware, getSavedResources);
router.delete('/deleteresource/:id' , authMiddleware, deleteResource);
router.get('/resourcesList', authMiddleware ,resourcesList);

module.exports = router;
