const express = require("express");
const { addMedecine, getAllAvailablesMedecines, getAllNotAvailablesMedecines, deleteMedecine, updateMedecine, getOneMedecineWithFileDetails } = require("../controllers/dataBaseController");
const router = express.Router();

router.post("/addmedecine", addMedecine);
router.get("/medecines", getAllAvailablesMedecines)
router.get("/notavmedecines", getAllNotAvailablesMedecines)
router.get("/medecine/:id", getOneMedecineWithFileDetails)
router.delete("/medecine/:id", deleteMedecine)
router.put("/medecine/:id", updateMedecine)
module.exports = {
    routes: router
  };