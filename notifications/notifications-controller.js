const admin = require('firebase-admin');
const { errorResponse, successResponse } = require('../config/response');
require("firebase/storage");
global.XMLHttpRequest = require("xhr2");

const sendNotification = async (req, res) => {
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
  successResponse.send(res, "notification send!")
  } catch (error) {
    errorResponse.send(res, error.message);
  }
};

module.exports = {sendNotification,}