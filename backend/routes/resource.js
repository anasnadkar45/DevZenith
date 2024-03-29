// Import necessary modules
const express = require('express');
const router = express.Router();
const { resourcesList, addResource, deleteResource } = require('../controllers/Resource');
const { authMiddleware } = require('../middleware');

// Route for user resource 
router.post("/addresource", authMiddleware, addResource)
router.delete('/deleteresource/:id' , authMiddleware, deleteResource)
router.get('/resourcesList', authMiddleware ,resourcesList)

module.exports = router;
