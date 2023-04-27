const firebase = require("../../config/db");
const { succesSendRequest, errorResponse, successResponse } = require("../../config/response");
const fireStore = firebase.firestore();
const savedPost = require("./saved-posts-model");
const admin = require('firebase-admin');
const SavePost = async (req, res) => {
  try {
    await fireStore.collection("savedPosts").add(
    { postId: req.body.postId,
      postTitle: req.body.postTitle,
      postContenu: req.body.postContenu,
      date: req.body.date,
      uname: req.body.uname,
      uphoto: req.body.uphoto,
      currentUserId: req.body.currentUserId
    });
    succesSendRequest.send(res, "post saved successfully")
  } catch (error) {
    errorResponse.send(res,error.message)
  }
};

const getAllSavedPostsAndTheirFiles = async(req,res)=> {
  const bucket = admin.storage().bucket();
  fireStore.collection("savedPosts").where('currentUserId', '==', req.params.currentUserId).get().then(snapshot => {
    const ids = snapshot.docs.map(doc => doc.data().postId);
    const promises = ids.map(id => {
      return fireStore.collection('posts').doc(id).get().then(doc => {
        return {id, data: doc.data(),};
      }).then(docData => {
        return bucket.getFiles({prefix: `posts/${id}/`,})
        .then(results => {
          const filePromises = results[0].map(file => {
            return file.getSignedUrl({action: 'read', expires: '03-17-2025',})
            .then(signedUrls => {
              return {name: file.name, downloadURL: signedUrls[0]};
            });
          });
          return Promise.all(filePromises).then(files => {
            return {...docData, files};
          });});
      });});
    Promise.all(promises).then(results => {
      const data = {posts: results,};
      successResponse.send(res, data)
    });
  });
}

const getAllSavedPosts = async (req, res) => {
  try {
    const posts = await fireStore.collection("savedPosts").where('currentUserId', '==', req.params.currentUserId);
    const data = await posts.get();
    const arr = [];
    if (data.empty) {
      res.status(200).json({ message: "No posts found" });
    } else {
      let total = 0;
      data.forEach((item) => {
        const savedpost = new savedPost(
          item.id,
          item.data().postId,
          item.data().postTitle,
          item.data().postContenu,
          item.data().date,
          item.data().uname,
          item.data().uphoto,
        );
        arr.push(savedpost);
        total = total + 1;
      });
      successResponse.send(res, arr)
    }
  } catch (error) {
    errorResponse.send(res, error.message );
  }};

const deleteSavedPost = async (req,res) => {
  const collectionRef = fireStore.collection("savedPosts");
  const query = collectionRef.where('postId', '==', req.params.id);
  query.get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
    doc.ref.delete().then(() => {
      successResponse.send(res, "post deleted successfully")
    }).catch(error => {
      errorResponse.send(res, error.message );
    });
  });
}).catch(error => {
  console.error('Error getting documents to delete:', error);
});};

const countSavedPosts = async (req, res) => {
  fireStore.collection("savedPosts").where('currentUserId', '==', req.params.currentUserId).get()
  .then((snapshot) => {
    const savedPostCount = snapshot.size;
    successResponse.send(res, {count: savedPostCount})
  })
  .catch((error) => {
    errorResponse.send(res, error.message );
  });
 }
module.exports = { SavePost, getAllSavedPosts, deleteSavedPost, countSavedPosts, getAllSavedPostsAndTheirFiles,}