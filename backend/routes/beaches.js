const express = require("express");
const router = express.Router();

const beachController = require("../controllers/beachController");
// const validateId = require("../middleware/validateId");

router.get("/", beachController.listBeaches);
// router.get("/:id", validateId, beachController.getSingleBeach);

module.exports = router;
