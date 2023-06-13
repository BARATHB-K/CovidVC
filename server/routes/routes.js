const express = require("express");
const router = express.Router();
const Controller = require("../controllers/control");

router.post("/signup/user", Controller.addUser);
router.post("/signup/admin", Controller.addAdmin);


router.post("/login/user", Controller.login);
router.post("/login/admin", Controller.adminlogin);


router.post("/admin/addCentres", Controller.addCentres);
router.delete("/admin/removeCentres/:id", Controller.removeCentres);

router.get("/admin/dosage-details", Controller.dosageDetails);
router.put("/users/dosageDec/:id", Controller.updateDosage);
router.get("/user/vaccination-centres", Controller.searchCentres);


router.post("/user/book-slot", Controller.bookDosage);

router.get('/user/logout', Controller.userLogout);

module.exports = router;