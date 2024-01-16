const mongoose = require('mongoose')

const seatsSchema = new mongoose.Schema({
    seatNumber: {
        type: String,
        required: true
    },
    seatLocation: {
        type: String,
        required: true
    },
    seatStatus: {
        type: Boolean,
        required: true
    },
    slot: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('seats', seatsSchema)