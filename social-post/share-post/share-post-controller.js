const firebase = require("../../config/db");
const { successResponse, errorResponse } = require("../../config/response");
const sharedPost = require("./share-post-model");
const fireStore = firebase.firestore();

const SharePost = async (req, res, next) => {
  try {
    collectionRef = fireStore.collection("sharedPosts")
    collectionRef.where('currentUserId', '==', req.body.currentUserId).where('idSharedUser', '==', req.body.idSharedUser).where('postId', '==', req.body.postId).get()
    .then(async snapshot => {
      if (snapshot.empty) {
        await fireStore.collection("sharedPosts").add({ 
          postId: req.body.postId,
          postContenu: req.body.postContenu,
          postPhoto: req.body.postPhoto,
          adminName: req.body.adminName,
          adminPhoto: req.body.adminPhoto,
          currentUserId: req.body.currentUserId,
          currentUserName: req.body.currentUserName,
          currentUserphoto : req.body.currentUserphoto,
          idSharedUser: req.body.idSharedUser,
          dateShare : new Date(),
        });
        res.status(201).json({ message: "post shared successfully" });
      }
      else 
        res.status(404).json({ message: "you have shared already with this user" });
    })
  } 
  catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getAllSharedPostsByCurrentUserId = async (req, res) => {
  try {
    const sharedposts = await fireStore.collection("sharedPosts").where('idSharedUser', '==', req.params.idSharedUser);
    const sharedPosts = await sharedposts.get();
    const sharedpostslist = [];
      if (sharedPosts.empty) {
        res.status(404).json({ message: "No posts found" });
      } else {
        let total = 0;
        sharedPosts.forEach((item) => {
          const sharedpost = new sharedPost(
            item.id,
            item.data().postId,
            item.data().postContenu,
            item.data().postPhoto,
            item.data().adminName,
            item.data().adminPhoto,
            item.data().currentUserId,
            item.data().currentUserName,
            item.data().currentUserphoto,
            item.data().idSharedUser,
            item.data().dateShare
          );
          sharedpostslist.push(sharedpost);
          total = total + 1;
        });
        successResponse.send(res, {sharedposts: sharedpostslist})
      }
  } catch (error) {
      errorResponse.send(res, error.message);
  }
};

module.exports = { SharePost, getAllSharedPostsByCurrentUserId}