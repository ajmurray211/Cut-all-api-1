const Part = require('../models/part')
const mongoose = require('mongoose')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Set up file filter for multer
const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed.'), false);
    }
}

// Set up multer upload instance
const upload = multer({ storage: storage, fileFilter: fileFilter });

//Show all parts
const getParts = async (req, res) => {
    Part
        .find({})
        .sort({ onHand: 1 })
        .populate({ path: 'drawList', options: { limit: 5, sort: { date: 1 } } })
        .then(data => res.status(200).json({ data: data }))
        .catch(error => res.status(400).json({ error: error.message }))
}

// Sorting parts
const sortParts = async (req, res) => {
    const { name, tool, sort } = req.query
    let searchQuery = {}
    if (name) {
        searchQuery.name = { $regex: `${name}` }
    } else if (tool) {
        searchQuery.tool = { $regex: `${tool}` }
    }

    let sortQuery = {}
    if (sort === 'dec') {
        sortQuery.onHand = -1
    } else {
        sortQuery.onHand = 1
    }

    Part.find(searchQuery)
        .sort(sortQuery)
        .populate({ path: 'drawList', options: { limit: 5, sort: { date: 1 } } })
        .then(data => res.status(200).json({ data: data }))
        .catch(err => res.status(404).json({ error: 'There was a problem sorting.' }))
}

// get a part by id
const getSinglePart = async (req, res) => {
    Part.findById(req.params.id).populate('drawList')
        .then(data => res.status(200).json({ data: data }))
}

// create a part
const createNewPart = async (req, res) => {
    console.log('new part hit', req.body);
    upload.single('image')(req, res, async (err) => {
        const { name, onHand, tool } = req.body;

        let emptyFields = [];

        if (!name) {
            emptyFields.push('name');
        }
        if (!onHand) {
            emptyFields.push('onHand');
        }
        if (!tool) {
            emptyFields.push('tool');
        }
        if (emptyFields.length > 0) {
            return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
        }

        // Create the part object
        const part = new Part({ name, onHand, tool });

        // Upload image if provided
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'Error uploading file.', err });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }

        // Get the image path from the request
        const imagePath = req.file ? req.file.path : null;

        // Assign the image path if provided
        if (imagePath) {
            part.image = imagePath;
        }

        // Save the part to the database
        try {
            await part.save();
            res.status(201).json(part);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
};

const updatePart = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such Part exists.' });
    }

    // Find the part by ID
    try {
        const part = await Part.findById(id);

        if (!part) {
            return res.status(404).json({ error: 'No such Part exists.' });
        }

        // Create a middleware to handle the form data with file upload
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            // Access the form data from req.body
            const { name, onHand, tool } = req.body;

            // Update the part fields
            part.name = name || part.name;
            part.onHand = onHand || part.onHand;
            part.tool = tool || part.tool;

            if (req.file) {
                // Remove the existing image if it's not the "cutall_logo.png"
                if (part.image !== 'path/to/cutall_logo.png') {
                    fs.unlink(part.image, (err) => {
                        if (err) {
                            console.error('Error deleting existing image:', err);
                        }
                    });
                }

                // Assign the new image path
                part.image = req.file.path;
            }


            try {
                // Save the updated part
                await part.save();
                res.status(201).json({ message: 'Part updated successfully.' });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Delete a part by ID
const deletePart = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such Part exists.' })
    }

    const part = Part.findByIdAndDelete({ _id: id })

    if (!part) {
        return res.status(400).json({ error: 'No such workout' })
    }

    res.status(204).json(part)
}

module.exports = {
    getParts,
    getSinglePart,
    deletePart,
    sortParts,
    createNewPart,
    updatePart
}