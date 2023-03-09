const firebase = require("../db");
const User  = require("../models/user");
const fireStore = firebase.firestore();
const firebasee = require('firebase');
const { getAuth, UserRecord } = require('firebase-admin/auth');
const requestIp = require('request-ip');
const Post = require("../models/post");
const { getFirestore } = require("firebase-admin/firestore");
const { firestore } = require("firebase-admin");
const savedPost = require("../models/savedPost");
const admin = require('firebase-admin');
let users = [];

const SavePost = async (req, res, next) => {
  try {
    await fireStore.collection("savedPosts").add(
    { 
        postId: req.body.postId,
        postTitle: req.body.postTitle,
        postContenu: req.body.postContenu,
        date: req.body.date,
        uname: req.body.uname,
        uphoto: req.body.uphoto,
        currentUserId: req.body.currentUserId
    });
    res.status(201).json({ message: "post saved successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};
const getAllSavedPostsAndTheirFiles = async(req,res, next)=> {
  const bucket = admin.storage().bucket();
  fireStore.collection("savedPosts").where('currentUserId', '==', req.params.currentUserId).get().then(snapshot => {
    const ids = snapshot.docs.map(doc => doc.data().postId);
  console.log(ids);
    // Use the IDs to find the corresponding folders in Firebase Storage
    const promises = ids.map(id => {
      return fireStore.collection('posts').doc(id).get().then(doc => {
        return {
          id,
          data: doc.data(),
        };
      }).then(docData => {
        return bucket.getFiles({
          prefix: `posts/${id}/`,
        }).then(results => {
          const filePromises = results[0].map(file => {
            return file.getSignedUrl({
              action: 'read',
              expires: '03-17-2025',
            }).then(signedUrls => {
              return {name: file.name, downloadURL: signedUrls[0]};
            });
          });
    
          return Promise.all(filePromises).then(files => {
            return {...docData, files};
          });
        });
      });
    });
  
    // Wait for all promises to resolve and return the results in a JSON file
    Promise.all(promises).then(results => {
      const data = {
        posts: results,
      };
      res.json(data)
      //fs.writeFileSync('./res.json', JSON.stringify(data));
    });
  });
}

const getAllSavedPosts = async (req, res, next) => {
  const date  = new Date();
  try {
    console.log("Getting all saved posts");
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
      res.status(200).json(arr);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
 const deleteSavedPost = async (req,res, next) => {
  const collectionRef = fireStore.collection("savedPosts");
const query = collectionRef.where('postId', '==', req.params.id);

// Execute the query to get the documents to delete
query.get().then(querySnapshot => {
  querySnapshot.forEach(doc => {
    // Delete each document that matches the query
    doc.ref.delete().then(() => {
      res.status(200).json({ message: "post deleted successfully" })
    }).catch(error => {
      res.status(400).json({ message: error.message});
    });
  });
}).catch(error => {
  console.error('Error getting documents to delete:', error);
});
 };
 const countSavedPosts = async (req, res, next) => {
  fireStore.collection("savedPosts").where('currentUserId', '==', req.params.currentUserId).get()
  .then((snapshot) => {
    const savedPostCount = snapshot.size;
    res.status(200).json({count: savedPostCount})
  })
  .catch((error) => {
    res.status(400).json({message: error.message})
  });
 }


module.exports = {
    SavePost,
    getAllSavedPosts,
    deleteSavedPost,
    countSavedPosts,
    getAllSavedPostsAndTheirFiles
  }