const express = require("express");
const multer = require('multer');
const { 
    getAllFiltedFilesByUserid, 
    addFile1, 
    addFile2, 
    downloadFile, 
    deleteFile, 
    getOnefile,
    deleteFileFromDownloadURLForMedecine,
    deleteFileFromDownloadURLForPost} 
    = require("../controllers/fileController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');
const router = express.Router();

router.post("/sendfilee", upload, addFile1);
router.post("/sendfile", upload, addFile2);
router.get("/downoaldfile", downloadFile);
router.get("/getfile/:name", getOnefile);
router.get("/files/:uid", getAllFiltedFilesByUserid);
router.delete("/deletefile/:fileName", deleteFile);
router.delete("/file", deleteFileFromDownloadURLForMedecine);
router.delete("/filepost", deleteFileFromDownloadURLForPost);
module.exports = {
    routes: router
  };