const firebase = require("firebase");
const config = require("./config");
const admin = require('firebase-admin');
// service account file custom for serve    
var serviceAccount = require("./myfirstapp-72a20-firebase-adminsdk-e2rpe-183f3a4acd.json");
 
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://myfirstapp-72a20-default-rtdb.firebaseio.com"
});
const db = firebase.initializeApp(config.firebaseConfig);

 
module.exports = db;