const admin = require('firebase-admin');
require("firebase/storage");
global.XMLHttpRequest = require("xhr2");
const deleteFileFromDownloadURLForPost = async(req, res) => {
  const bucket = admin.storage().bucket();
  const fileUrl = req.body.downloadURL
  const startIndex = fileUrl.indexOf('posts/');
  const endIndex = fileUrl.indexOf('?');
  const resultString = fileUrl.substring(startIndex, endIndex);
  const file = bucket.file(resultString);
  file.delete().then(() => {
    res.status(200).send({message: "file deleted"})
  }).catch((error) => {
    res.status(400).send({message: error})
  });}
module.exports = {deleteFileFromDownloadURLForPost}