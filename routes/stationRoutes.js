const express = require("express");
const router = express.Router();
const stationController = require("../controllers/stationController");

router.get("/", stationController.getAllStations);
router.post("/", stationController.addStation);
router.get("/:stationId", stationController.getStationById);
router.put("/:stationId", stationController.updateStation);
router.delete("/:stationId", stationController.deleteStation);

module.exports = router;
