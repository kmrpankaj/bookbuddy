const mongoose = require('mongoose')

const studentsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    parentsphone: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    documentid: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    regisDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    role: {
        type: String,
        required: true,
        default: "Student"
    },
    seatAssigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seats'
    },
})

module.exports = mongoose.model('Students', studentsSchema)