const admin = require('firebase-admin');
const firebase = require("../config/db");
require("firebase/storage");
global.XMLHttpRequest = require("xhr2");
const sendNotification = async (res) => {
  try {
    await admin.messaging().sendMulticast({
        tokens: ["BBG8yFQpySQK9QRC8QDI98bVQerCwIw_sGD1Qj-vH0z_eB4KFYW3XhFq1OHRnYoyQ-BY8eWg6VoHEi2JpjyW6gM", 
        "c2oTqjhQVyTwGbvAw39Ztd:APA91bGaJttI_ODcCttVbXV8WqkU4KgxsMWLr9r6BEeow3j_foBlzfU3S3DkrkKw1bzVcGcliIiD-AqIURb7jYM1pOWjqv119smOEKWbBxwiVY9vMUEJTZipd7IoK9d2kvW90ehAvmQg"],
        notification: {
          title: "heeey!!!!",
          body: "hello auzy",
          imageUrl: "https://www.shutterstock.com/image-vector/notification-icon-vector-material-design-260nw-759841507.jpg",
        },
    })
    res.status(200).json({ message: "notification send!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }};
module.exports = {sendNotification,}