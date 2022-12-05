const Joi = require('Joi')

module.exports.partSchema = Joi.object({
    part: Joi.object({
        name: Joi.string().required(),
        onHand: Joi.number().required(),
        tool: Joi.string().required()
    }).required()
})

module.exports.workerSchema = Joi.object({
    worker: Joi.object({
        name: Joi.string().required(),
        amountTaken: Joi.number().required(),
        dateTaken: Joi.date().required()
    }).required()
})