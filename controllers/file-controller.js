const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const functions = require('firebase-functions')
const firebase = require("../db");
const storagee = require('@google-cloud/storage');
const storage = firebase.storage().ref();
require("firebase/storage");
global.XMLHttpRequest = require("xhr2");

const storageClient = new storagee.Storage();



const deleteFileFromDownloadURLForPost = async(req, res, next) => {
  const bucket = admin.storage().bucket();
  //const fileUrl = 'https://storage.googleapis.com/myfirstapp-72a20.appspot.com/medecines/Yy6uo1IL4FyPA6sly0Jn/tylenolo.jpg?GoogleAccessId=firebase-adminsdk-e2rpe%40myfirstapp-72a20.iam.gserviceaccount.com&Expires=1742166000&Signature=bPfAr0f7qVqeEj%2BF9GvrG4HysLlAsH%2F%2FL1ep3gXMineJZGLzcXZIIIaaFF0tOeci1OcpHGF00F6vHJoh%2FyQwwydlcXR6YqW54cSbJpvVm9KkXwKv8pMNk2o9%2BbW0bEW2uUevT9k4UOtFtISjW8yCwfopHBOmgEh5Nuptwd1EYCws7N0XxcQRE3z7kyNGRrUkZqJ%2BDWtIFj8G7TCMdLOEmmenC8uLCpgnora0Guixu375M%2FCADzKm8eke5IKinVW%2B6dlfobQnNIiuZM47oknxNdwUPlwADywMoJNJG%2BAc2Y39fCyD1%2BIeEd23FXYGSMBv4k4mRyN4wh90pRorxelFVw%3D%3D';
  const fileUrl = req.body.downloadURL
  const startIndex = fileUrl.indexOf('posts/');
  const endIndex = fileUrl.indexOf('?');
  const resultString = fileUrl.substring(startIndex, endIndex);
  console.log(resultString)
    // Get a reference to the file
    const file = bucket.file(resultString);
    file.delete().then(() => {
      res.status(200).send({message: "file deleted"})
  }).catch((error) => {
    res.status(400).send({message: error})
  });
  }




module.exports = {
    
    deleteFileFromDownloadURLForPost
  }