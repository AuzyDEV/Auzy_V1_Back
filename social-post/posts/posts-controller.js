const firebase = require("../../config/db");
const fireStore = firebase.firestore();
const Post = require("../../admin-functions/post-management/post-management-model");
const admin = require('firebase-admin');
const { successResponse, errorServer } = require("../../config/response");

const getPostsForUsers = async (req, res) => {
  let listposts = [];
  const date = new Date();
  try {
    fireStore.collection("posts").where("visibility", "==", true).orderBy('date', 'desc').get()
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
  }};

const getAllPostsAndTheirFiles = async(req, res)=> {
  const bucket = admin.storage().bucket();
  fireStore.collection("posts").where("visibility", "==", true).orderBy('date', 'desc').get()
  .then(snapshot => {
    const ids = snapshot.docs.map(doc => doc.id);
    const promises = ids.map(id => {
      return fireStore.collection('posts').doc(id).get().then(doc => {
        return {id,data: doc.data(),};
      }).then(docData => {
        return bucket.getFiles({prefix: `posts/${id}/`,}).then(results => {
          const filePromises = results[0].map(file => {
            return file.getSignedUrl({action: 'read',expires: '03-17-2025',})
            .then(signedUrls => {
              return {name: file.name, downloadURL: signedUrls[0]};
            });
          });
        return Promise.all(filePromises).then(files => {
          return {...docData, files};
        });
      });
    });
  });
  Promise.all(promises).then(results => {const posts = {posts: results,};
    //res.json(data)
    successResponse.send(res, posts)
    });
  });}

const getOnePostWithFileDetails  = async (req, res)=> {
  const bucket = admin.storage().bucket();
  const document = fireStore.collection("posts").doc(req.params.id);
  const documentSnapshot = await document.get();
  const post = documentSnapshot.data();
  const folder = req.params.id;
  const [allfiles] = await bucket.getFiles({ prefix: `posts/${folder}/` });
  const files = [];
  for (const file of allfiles) {
    const [url] = await file.getSignedUrl({ action: 'read', expires: '03-17-2025' });
    files.push({downloadURL: url});
  }
  const response = {post,files};
return successResponse.send(res, response)
}

const getAllPostsAndFiles = async(req, res)=>{
  let postList = [];
  fireStore.collection("posts").where("visibility", "==", false).orderBy('date', 'desc').get()
  .then(function(querySnapshot) {
    const bucket = admin.storage().bucket();
    querySnapshot.forEach( (doc) => {
      var data = doc.data();
      var id = doc.id;
      const ids = snapshot.docs.map(doc => doc.id);
      bucket.getFiles({prefix: `${id}/`}).then( ([files]) => {
        files.forEach(file => {file.getSignedUrl({action: "read",expires: "03-09-2491"})
        .then(posts => {
          info.push({posts});
        }).then(() => {
          successResponse.send(res, postList)})}
      )}
    )});
  });
}

const getSavedPostWithBoolAttributeAndTheirFiles = async (req, res) => {
  const firstCollection =  fireStore.collection('posts');
  const secondCollection = fireStore.collection("savedPosts");
  firstCollection.where("visibility", "==", true).get()
  .then((snapshot) => {
    let ids = [];
    snapshot.forEach((doc) => {ids.push(doc.id);});
    let promises = ids.map((id) => {
      return secondCollection.where("postId", "==", id).where("currentUserId", "==", req.params.currentUserId).get();
    });
    Promise.all(promises).then((snapshots) => {
      let posts = [];
      snapshots.forEach((snapshot, index) => {
      let existsInCollection2 = !snapshot.empty;
      firstCollection.doc(ids[index]).get().then((doc) => {
        const bucket = admin.storage().bucket();
        bucket.getFiles({prefix: `posts/${ids[index]}/`}).then( ([files]) => {
          files.forEach(file => {
            file.getSignedUrl({action: "read",expires: "03-09-2491"}).then(data => {
              posts.push({
                id: ids[index],
                data: doc.data(),
                existsInCollection2,
                downloadURL: data[0]
              });})
              .then(() => {
                if (posts.length === snapshots.length) {
                  successResponse.send(res, { posts })
                }
              })})
            }).catch((error) => {
              errorServer.send(res, { error });
            });})
          .catch((error) => {
            errorServer.send(res, { error });
          });});
      })
      .catch((error) => {
        errorServer.send(res, { error });});
  })
  .catch((error) => {
    errorServer.send(res, { error });
  });
}
module.exports = { getPostsForUsers, getAllPostsAndFiles, getAllPostsAndTheirFiles, getOnePostWithFileDetails, getSavedPostWithBoolAttributeAndTheirFiles,}