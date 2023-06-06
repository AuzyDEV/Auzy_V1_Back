const firebase = require("../config/db");
const fireStore = firebase.firestore();
const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const { errorResponse } = require("../config/response");

const addDiscussionAssUser = async (req, res) => {
  try {
    const querySnapshot = await fireStore
      .collection("disass")
      .where("assId", "==", req.params.assId)
      .where("cusId", "==", req.params.cusId)
      .get();

    if (querySnapshot.empty) {
  
    await fireStore.collection("disass").add({ 
      assId: req.params.assId,
      cusId: req.params.cusId,});
      res.sendStatus(200);

    } else {
      errorResponse.send(res, "error: combinaison already exists ")
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }

};

async function getListOfCurrentUsersId(assId) {
  const snapshot = await fireStore
    .collection('disass')
    .where('assId', '==', assId)
    .get();

  const idCurrentUserList = [];
  snapshot.forEach((doc) => {
    const idCurrentUser = doc.get('cusId');
    idCurrentUserList.push(idCurrentUser);
  });

  return idCurrentUserList;
}


const getAllMessagesByColleactionPath = async (req, res) => {
  const discussionsList = [];
  const chatDocId = req.params.chatDocId;
  const discussionsDocId = req.params.discussionsDocId;

  try {
    const messagesRef = fireStore
      .collection('chats')
      .doc(chatDocId)
      .collection('discussions')
      .doc(discussionsDocId)
      .collection('messages');

    const querySnapshot = await messagesRef.get();

    if (!querySnapshot.empty) {
      console.log(`Messages for Chat Document ID ${chatDocId}:`);
      querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        discussionsList.push(messageData);
      });
    } else {
      console.log(`No messages found for Chat Document ID ${chatDocId}`);
    }

    res.json(discussionsList);
  } catch (error) {
    console.error(`Error retrieving messages:`, error);
    res.status(500).json({ error: 'Error retrieving messages' });
  }
};


const getUserData = async (userId) => {
  try {
    const userRecord = await getAuth().getUser(userId);
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
    };
    return userData;
  } catch (error) {
    console.error(`Error retrieving user data for user ID ${userId}:`, error);
    return null;
  }
};

const getAllUsersThatSendMsgForASpecificAssistant = async (req, res) => {
  const idCurrentUserList = await getListOfCurrentUsersId(req.params.assId);
  const userDataList = [];

  try {
    for (const userId of idCurrentUserList) {
      const userData = await getUserData(userId);
      if (userData) {
        userDataList.push(userData);
      }
    }

    res.json(userDataList);
  } catch (error) {
    console.error(`Error retrieving user data:`, error);
    res.status(500).json({ error: 'Error retrieving user data' });
  }
};



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

/*const hello = async (req, res) => {
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
}*/

module.exports = {getAllMessages, getCountMessagesByUserId, getCountMessages, 
                  addDiscussionAssUser, getListOfCurrentUsersId, 
                  getAllMessagesByColleactionPath,
                  getAllUsersThatSendMsgForASpecificAssistant}