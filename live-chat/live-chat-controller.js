const firebase = require("../config/db");
const fireStore = firebase.firestore();
const admin = require('firebase-admin');


const getAllMessages = async (req, res, next) => {
  try {
    const idUser = req.params.idUser;
    const snapshot = await firebase.firestore().collection(`chats/${idUser}/messages`).orderBy('createdAt','desc').get();
    result=  snapshot.docs.map(doc => doc.data());
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getCountMessagesByUserId = async (req, res) => {
  try {
    const idUser = req.params.idUser;
    firebase.firestore().collection(`chats/${idUser}/messages`).get()
    .then((snapshot) => 
    res.status(200).send({length: snapshot.docs.length})
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCountMessages = async (req, res) => {
  const users = await fireStore.collection(`chats/QMvFpTWIFrf7h79mWVr0mBhy6a72/messages`);
  const data = await users.get();
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

const hello = async (req, res) => {
  // Assuming you have the discussions document ID
const discussionsDocId = 'J22mPStTxWdiIHlJGVAe7gFYpSg1';

// Querying Firestore to find the discussions document
admin.firestore().collectionGroup('discussions')
  .where(admin.firestore.FieldPath.documentId(), '==', discussionsDocId)
  .get()
  .then((querySnapshot) => {
    if (!querySnapshot.empty) {
      const discussionsDoc = querySnapshot.docs[0];
      const chatDocId = discussionsDoc.ref.parent.parent.id;

      console.log('Chat Document ID:', chatDocId);
    } else {
      console.log('Discussions document not found');
    }
  })
  .catch((error) => {
    console.error('Error retrieving discussions document:', error);
  });
}

module.exports = {getAllMessages, getCountMessagesByUserId, getCountMessages, hello}