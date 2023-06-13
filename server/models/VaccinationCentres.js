const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const vaccinationCentreSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },

    workingHours: {
        type: String,
        required: true,
    },
    dosage: {
        type: Number,
        required: true,
    },
});

const Schema1 = mongoose.Schema;

const dosageSchema = new Schema1({
    vaccinationCentre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VaccinationCentre',
    },
    dosage: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model("Dosage", dosageSchema);

module.exports = mongoose.model("VaccinationCentre", vaccinationCentreSchema);

// Define VaccinationCentre schema && Dosage schema



