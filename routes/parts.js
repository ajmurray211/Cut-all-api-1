const express = require('express')
const router = express.Router()
const {
    getParts,
    getSinglePart,
    deletePart,
    sortParts,
    createNewPart,
    updatePart
} = require('../controllers/parts.js')

//Show all parts
router.get('/', getParts)

// Sorting parts
router.get('/search', sortParts)

// get a part by id
router.get('/:id', getSinglePart)

// Make a new part
router.post('/', createNewPart)

//Update one part by ID
router.put('/:id', updatePart)

//Delete a part by ID
router.delete('/:id', deletePart)

module.exports = router
