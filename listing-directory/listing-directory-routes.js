const express = require("express");
const { addDB, deleteDB, updateDB, getAllDB, getOneDBWithFileDetails, getAllDBWithSpecificAttribute } = require("./listing-directory-controller");
const router = express.Router();
router.post("/addDB", addDB)
router.put("/updateDB/:id", updateDB)
router.get("/DB/:collectionName", getAllDB)
router.get("/DataB/:collectionName/:speciality", getAllDBWithSpecificAttribute)
router.get("/DB/:collectionName/:id", getOneDBWithFileDetails)
router.delete("/DB/:collectionName/:id", deleteDB)
module.exports = {routes: router};