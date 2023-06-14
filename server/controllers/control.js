const User = require("../models/User");
const Admin = require("../models/Admin");
const VaccinationCentres = require("../models/VaccinationCentres");
const Dosage = require("../models/VaccinationCentres");
const Booking = require("../models/BookingDosage");

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]ponnnnnu89ywe";


// Adding User
const addUser = async (req, res) => {
    const { email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);

    let user;

    try {
        user = new User({
            email,
            password: encryptedPassword,
        });
        await user.save();
    } catch (err) {
        console.log(err);
    }

    if (!user) {
        return res.status(500).json({ message: "Unable To Add" });
    }
    return res.status(201).json({ user });
};

// Adding Admin if Want
const addAdmin = async (req, res) => {
    const { email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);

    let admin;

    try {
        admin = new Admin({
            email,
            password: encryptedPassword,
        });
        await admin.save();
    } catch (err) {
        console.log(err);
    }

    if (!admin) {
        return res.status(500).json({ message: "Unable To Add" });
    }
    return res.status(201).json({ admin });
};


//Login User
const login = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.json({ error: "User Not found" });
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ email: user.email }, JWT_SECRET);

        if (res.status(201)) {
            return res.json({ status: "ok", data: token });
        } else {
            return res.json({ error: "error" });
        }
    }
    res.json({ status: "error", error: "Invalid Password" });


};


// Login Admin
const adminlogin = async (req, res) => {

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
        return res.json({ error: "User Not found" });
    }

    if (await bcrypt.compare(password, admin.password)) {
        const token = jwt.sign({ email: admin.email }, JWT_SECRET);

        if (res.status(201)) {
            return res.json({ status: "ok", data: token });
        } else {
            return res.json({ error: "error" });
        }
    }
    res.json({ status: "error", error: "Invalid Password" });


};


// Adding Centers
const addCentres = async (req, res) => {
    const { name, address, workingHours, dosage } = req.body;
    let centre;
    try {
        centre = new VaccinationCentres({
            name,
            address,
            workingHours,
            dosage,
        });
        await centre.save();
    } catch (err) {
        console.log(err);
    }

    if (!centre) {
        return res.status(500).json({ message: "Unable To Add" });
    }
    return res.status(201).json({ centre });
};



// Removing Centers
const removeCentres = async (req, res) => {
    const id = req.params.id;
    let centre;
    try {
        centre = await VaccinationCentres.findByIdAndRemove(id);
    } catch (err) {
        console.log(err);
    }
    if (!centre) {
        return res.status(404).json({ message: "Unable To Delete By this ID" });
    }
    return res.status(200).json({ message: "Centres Successfully Deleted" });
};


// Get dosage details grouped by centres
const dosageDetails = async (req, res) => {
    try {
        const dosageDetails = await Dosage.aggregate([
            {
                $group: {
                    _id: '$name',
                    totalDosage: { $sum: '$dosage' },
                },
            },
        ]);
        res.status(200).json({ dosageDetails });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Update the Dosage Depending on User Booking 
const updateDosage = async (req, res) => {
    try {
        const documentId = req.params.id;

        const query = { _id: (documentId) };


        const update = { $inc: { dosage: -1, "metrics.orders": 1 } };

        const result = await VaccinationCentres.updateOne(query, update);

        if (result.modifiedCount === 1) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

// Serach For Vaccination Centers
const searchCentres = async (req, res) => {
    try {
        const vaccinationCentres = await VaccinationCentres.find({}, ' name address workingHours');
        res.json({ vaccinationCentres });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


// User Booking Dosage
const bookDosage = async (req, res) => {
    const { date } = req.body;

    try {
        // Check if the maximum limit of candidates (10) has been reached for the given date
        const booking = await Booking.findOne({ date });

        if (booking && booking.persons >= 10) {
            return res.json({ status: "notok", message: 'Booking limit reached for this date' });
        }

        // Create or update the booking count for the date
        if (booking) {
            booking.persons += 1;
            await booking.save();
        } else {
            const newBooking = new Booking({ date, persons: 1 });
            await newBooking.save();
        }
        return res.json({ status: "ok", message: 'Vaccination slot booked successfully' });

    } catch (error) {
        return res.json({ status: "notok", message: 'Booking limit reached for this date' });
    }
};



const userLogout = (req, res) => {
    try {
        req.session = null;
        console.log("logout");
        return res.status(200).send({ message: "You've Been Signed Out!" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }

};

exports.addUser = addUser;
exports.addAdmin = addAdmin;
exports.login = login;
exports.adminlogin = adminlogin;


exports.addCentres = addCentres;
exports.removeCentres = removeCentres;
exports.dosageDetails = dosageDetails;

exports.updateDosage = updateDosage;
exports.searchCentres = searchCentres;
exports.bookDosage = bookDosage;


exports.userLogout = userLogout;


