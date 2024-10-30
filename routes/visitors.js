const express = require('express');
const Visitor = require('../models/Visitor');
const router = express.Router();

// Helper function for sending error responses
const handleErrorResponse = (res, error, statusCode = 500) => {
    res.status(statusCode).send({ message: error.message });
};

// Create a new visitor
router.post('/', async (req, res) => {
    try {
        const visitor = new Visitor(req.body);
        const savedVisitor = await visitor.save();
        res.status(201).send(savedVisitor);
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

// Get all visitors
router.get('/', async (req, res) => {
    try {
        const visitors = await Visitor.find().select('-__v');
        res.send(visitors);
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

// Get a visitor by ID
router.get('/:id', async (req, res) => {
    try {
        const visitor = await Visitor.findById(req.params.id).select('-__v');
        if (!visitor) {
            return res.status(404).send({ message: 'Visitor not found' });
        }
        res.send(visitor);
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

// Update a visitor by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedVisitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVisitor) {
            return res.status(404).send({ message: 'Visitor not found' });
        }
        res.send(updatedVisitor);
    } catch (error) {
        handleErrorResponse(res, error, 400);
    }
});

// Delete a visitor by ID
router.delete('/:id', async (req, res) => {
    try {
        const visitor = await Visitor.findByIdAndDelete(req.params.id);
        if (!visitor) {
            return res.status(404).send({ message: 'Visitor not found' });
        }
        res.send({ message: 'Visitor deleted successfully' });
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

module.exports = router;
