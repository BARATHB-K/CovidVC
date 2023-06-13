
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/routes.js");
const cors = require("cors");
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());


app.use("/covidv", router);  // localhost:5000/covidv  

mongoose
    .connect(
        "mongodb+srv://admin:DzqahxZfebyhF54E@vacine.e9r5wuc.mongodb.net/Covid?retryWrites=true&w=majority"
    )
    .then(() => console.log("Connected To Database"))
    .then(() => {
        app.listen(5001);
    })
    .catch((err) => console.log(err));







