const firebase = require("../db");
const User  = require("../models/user-model");
const fireStore = firebase.firestore();
const firebasee = require('firebase');
const { getAuth, UserRecord } = require('firebase-admin/auth');
const requestIp = require('request-ip');

const getAllMessages = async (req, res, next) => {
  try {
    const idUser = req.params.idUser;
    const snapshot = await firebase.firestore().collection(`chats/${idUser}/messages`).orderBy('createdAt','desc').get();
    console.log(`user id: ${idUser}`);
    result=  snapshot.docs.map(doc => doc.data());
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getCountMessagesByUserId = async (req, res, next) => {
  try {
    const idUser = req.params.idUser;
    firebase.firestore().collection(`chats/${idUser}/messages`).get().then(
      (snapshot) =>  res.status(200).send({length: snapshot.docs.length}) 
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCountMessages = async (req, res, next) => {
  const users = await fireStore.collection(`chats/QMvFpTWIFrf7h79mWVr0mBhy6a72/messages`);
  const data = await users.get();
  const arr = [];
    if (data.empty) {
      res.status(200).json({ message: "No records found" });
    } else {
      let total = 0;
      data.forEach((item) => {
        console.log(item.id)
        total = total + 1;
      });
    }
};

module.exports = {
    getAllMessages,
    getCountMessagesByUserId,
    getCountMessages
  }