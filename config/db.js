const firebase = require("firebase");
const config = require("./config");
const admin = require('firebase-admin');
const rateLimit = require('express-rate-limit');
var serviceAccount = require("../myfirstapp-72a20-firebase-adminsdk-e2rpe-183f3a4acd.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://myfirstapp-72a20-default-rtdb.firebaseio.com",
    storageBucket: "gs://myfirstapp-72a20.appspot.com"
});
const db = firebase.initializeApp(config.firebaseConfig);
module.exports = db;