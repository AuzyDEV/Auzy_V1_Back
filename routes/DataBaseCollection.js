const express = require("express");
const { addDB, deleteDB, updateDB, getAllDB, getOneDBWithFileDetails } = require("../controllers/DataBaseCollectionController");
const router = express.Router();

router.post("/addDB", addDB);
router.delete("/deleteDB/:id", deleteDB)
router.put("/updateDB/:id", updateDB)
router.get("/DB/:collectionName", getAllDB)
router.get("/DB/:collectionName/:id", getOneDBWithFileDetails)
router.delete("/DB/:collectionName/:id", deleteDB)
module.exports = {
    routes: router
  };