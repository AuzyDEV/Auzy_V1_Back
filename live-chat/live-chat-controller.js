const firebase = require("../config/db");
const fireStore = firebase.firestore();
const { errorResponse } = require("../config/response");
const { getUserDataForChat } = require("../admin-functions/user-management/user-management-controller");

const addDiscussionAssUser = async (req, res) => {
  try {
    const querySnapshot = await fireStore.collection("disass").where("assId", "==", req.params.assId).where("cusId", "==", req.params.cusId).get();
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
  const snapshot = await fireStore.collection('disass').where('assId', '==', assId).get();
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
    const messagesRef = fireStore.collection('chats').doc(chatDocId).collection('discussions').doc(discussionsDocId).collection('messages');
    const querySnapshot = await messagesRef.get();
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        discussionsList.push(messageData);
      });
    } else {
      console.log(`No messages found for Chat Document ID ${chatDocId}`);
    }
  res.json(discussionsList);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving messages' });
  }
};

const getAllUsersThatSendMsgForASpecificAssistant = async (req, res) => {
  const idCurrentUserList = await getListOfCurrentUsersId(req.params.assId);
  const userDataList = [];
  try {
    for (const userId of idCurrentUserList) {
      const userData = await getUserDataForChat(userId);
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

module.exports = {getAllMessages, getCountMessagesByUserId, getCountMessages, addDiscussionAssUser, getListOfCurrentUsersId, getAllMessagesByColleactionPath, getAllUsersThatSendMsgForASpecificAssistant}