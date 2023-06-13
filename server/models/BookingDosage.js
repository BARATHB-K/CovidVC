const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    idv: {
        type: String,
        required: true,
    },
    centre: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        unique: true,
    },

    persons: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Booking", bookingSchema);

// Define Booking schema


