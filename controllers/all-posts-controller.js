const firebase = require("../db");
const fireStore = firebase.firestore();
const Post = require("../models/post-model");
const admin = require('firebase-admin');

const addPost = async (req, res, next) => {
  try {
    console.log("Adding new Post");
    await fireStore.collection("posts").add(
    { 
      title: req.body.title,
      contenu: req.body.contenu,
      date: new Date(),
      visibility: true,
      uid: req.body.uid,
      uname: req.body.uname,
      uphoto: req.body.uphoto
    }).then(docRef => {
      const response = {
        status: 'success',
        id: docRef.id
      };
      res.status(201).json(response);
    }) .catch(error => {
      const response = {
        status: 'error',
        message: error.message
      };
      res.status(400).json(response);
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    console.log("Getting all posts");
    const posts = await fireStore.collection("posts");
    const data = await posts.get();
    const arr = [];
    if (data.empty) {
      res.status(200).json({ message: "No posts found" });
    } else {
      let total = 0;
      data.forEach((item) => {
        const post = new Post(
          item.id,
          item.data().title,
          item.data().contenu,
          item.data().date,
          item.data().visibility,
          item.data().uid,
          item.data().uname,
          item.data().uphoto,
        );
        arr.push(post);
        total = total + 1;
      });
      res.status(200).json(arr);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPostById = async (req, res, next) => {
  try {
    console.log("Getting post= %s", req.params.id);
    const post = await fireStore.collection("posts").doc(req.params.id);
    const data = await post.get();
    if (!data.exists) {
      res.status(404).json({ message: "Record not found" });
    } else {
      res.status(200).json([data.data()]);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePost = async (req, res, next) => {
  try {
    console.log("Updating post= %s", req.params.id);
    const post = await fireStore.collection("posts").doc(req.params.id);
    await post.update(
        {
            title: req.body.title,
            contenu: req.body.contenu
    });
    res.status(200).json({ message: "Record updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePostVisisbilityToFalse = async (req, res, next) => {
  try {
    console.log("Updating visibilty post= %s", req.params.id);
    const post = await fireStore.collection("posts").doc(req.params.id);
    await post.update(
        {
            visibility: false,
    });
    res.status(200).json({ message: "Record updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePostVisibilityToTrue= async (req, res ,next) => {
  try {
    const post = await fireStore.collection("posts").doc(req.params.id);
    await  post.update(
      {
        visibility: true,
      }
    );
    res.status(200).json({message: "Record updated successfully"})
  } catch (error) {
    res.status(400).json({message: error.message })
  }
}


const deletePost = async (req, res, next) => {
  const bucket = admin.storage().bucket();
  try {
    const folder = req.params.id;
    console.log("Deleting post= %s", req.params.id);
    await fireStore.collection("posts").doc(req.params.id).delete();
    const [allfiles] = await bucket.getFiles({ prefix: `posts/${folder}/` });
    for (const file of allfiles) {
    await file.delete();
  }
    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    
    res.status(400).json({ message: error.message });
  }
};
const getPostsForUsers = async (req, res, next) => {
  let listposts = [];
  const date = new Date();
  try {
    fireStore.collection("posts")
    .where("visibility", "==", true)
    .orderBy('date', 'desc')
    .get()
    .then(snapshot => {
      snapshot.forEach(item => {
        const post = new Post(
          item.id,
          item.data().title,
          item.data().contenu,
          date.toDateString(item.data().date),
          item.data().visibility,
          item.data().uid,
          item.data().uname,
          item.data().uphoto,
        );
        listposts.push(post)
      });
      res.status(200).json({posts: listposts})
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
  } catch (error) {
    console.log(error.message)
  }
 
};
const getAllPostsAndTheirFiles = async(req,res, next)=> {
  const bucket = admin.storage().bucket();
  fireStore.collection("posts").where("visibility", "==", true).orderBy('date', 'desc').get().then(snapshot => {
    const ids = snapshot.docs.map(doc => doc.id);
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
    Promise.all(promises).then(results => {
      const data = {
        posts: results,
      };
      res.json(data)
    });
  });
}
const getOnePostWithFileDetails  = async (req, res, next)=> {
  const bucket = admin.storage().bucket();
  const document = fireStore.collection("posts").doc(req.params.id);
  const documentSnapshot = await document.get();
  const data = documentSnapshot.data();

  const folder = req.params.id;
  const [allfiles] = await bucket.getFiles({ prefix: `posts/${folder}/` });

  const files = [];
  for (const file of allfiles) {
    const [url] = await file.getSignedUrl({ action: 'read', expires: '03-17-2025' });
    files.push({downloadURL: url});
  }
  const response = {
    data,
    files
  };
  return res.json(response)}

const getAllPostsAndFiles = async(req, res, next)=>{
  let info = [];
  fireStore.collection("posts").where("visibility", "==", false).orderBy('date', 'desc').get()
  .then(function(querySnapshot) {
    const bucket = admin.storage().bucket();
    querySnapshot.forEach( (doc) => {
      var data = doc.data();
      var id = doc.id;
      const ids = snapshot.docs.map(doc => doc.id);
      bucket.getFiles({prefix: `${id}/`}).then( ([files]) => {
        files.forEach(file => {
          file.getSignedUrl({
            action: "read",
            expires: "03-09-2491"
        }).then(data => {
          info.push({data});
        }).then(() => {
          console.log(info)
          res.status(200).send(info)})})})});});}

const getSavedPostWithBoolAttributeAndTheirFiles = async (req, res) => {
  const resultList = [];
  const firstCollection =  fireStore.collection('posts');
  const secondCollection = fireStore.collection("savedPosts");
  firstCollection.where("visibility", "==", true).get()
  .then((snapshot) => {
    let ids = [];
    snapshot.forEach((doc) => {
      ids.push(doc.id);
    });
    let promises = ids.map((id) => {
      return secondCollection.where("postId", "==", id).where("currentUserId", "==", req.params.currentUserId).get();
    });
    Promise.all(promises)
      .then((snapshots) => {
        let posts = [];
        snapshots.forEach((snapshot, index) => {
          let existsInCollection2 = !snapshot.empty;
          firstCollection.doc(ids[index]).get()
            .then((doc) => {
              const bucket = admin.storage().bucket();
               bucket.getFiles({prefix: `posts/${ids[index]}/`}).then( ([files]) => {
                files.forEach(file => {
                  file.getSignedUrl({
                    action: "read",
                    expires: "03-09-2491"
                }).then(data => {
                  posts.push({
                    id: ids[index],
                    data: doc.data(),
                    existsInCollection2,
                    downloadURL: data[0]
                  });
                }).then(() => {
                  if (posts.length === snapshots.length) {
                    res.json({ posts });
                  }})})
            }).catch((error) => {
              res.status(500).json({ error });
            });})
            .catch((error) => {
              res.status(500).json({ error });
            });});
      })
      .catch((error) => {
        res.status(500).json({ error });});
  })
  .catch((error) => {
    res.status(500).json({ error });
  });}



module.exports = {
    addPost,
    getAllPosts,
    getPostsForUsers,
    getPostById,
    updatePost,
    deletePost,
    updatePostVisisbilityToFalse,
    updatePostVisibilityToTrue,
    getAllPostsAndFiles,
    getAllPostsAndTheirFiles,
    getOnePostWithFileDetails,
    getSavedPostWithBoolAttributeAndTheirFiles,
    
  }