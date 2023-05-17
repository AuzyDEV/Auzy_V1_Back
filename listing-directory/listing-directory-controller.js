const firebase = require("../config/db");
const fireStore = firebase.firestore();
const admin = require('firebase-admin');
const { errorNotFound, errorResponse, successResponse } = require("../config/response");
const { succesSendRequest } = require("../config/response");


const addDB = async (req, res) => {
  try {
    const { collectionName, ...data } = req.body;
    await fireStore.collection(req.body.collectionName).add(data).then(docRef => {
      const response = {status: 'success',id: docRef.id};
      succesSendRequest.send(res, response)}) 
    .catch(error => {
      errorResponse.send(res, error);
    });
  } catch (error) {
    errorNotFound.send(res, error);
  }
}


const deleteDB = async (req, res) => {
  const bucket = admin.storage().bucket();
  try {
    const collectionName = req.params.collectionName;
    const folder = req.params.id;
    await fireStore.collection(collectionName).doc(req.params.id).delete();
    const [allfiles] = await bucket.getFiles({ prefix: `${collectionName}/${folder}/` });
    for (const file of allfiles) {
      await file.delete();
    }
    successResponse.send(res, "DB deleted successfully")
  } catch (error) {
    errorResponse.send(res, error.message)
  }
};


const updateDB = async (req, res) => {
  try {
    const { collectionName, ...data } = req.body;
    const post = await fireStore.collection(req.body.collectionName).doc(req.params.id);
    await post.update(data);
      successResponse.send(res, "Record updated successfully")
  } catch (error) {
      errorResponse.send(res, error.message )
  }
};


const getOneDBWithFileDetails  = async (req, res) => {
  const collectionName = req.params.collectionName;
  const bucket = admin.storage().bucket();
  const document = fireStore.collection(collectionName).doc(req.params.id);
  const documentSnapshot = await document.get();
  const id = documentSnapshot.id; 
  const data = documentSnapshot.data();
  const combinedData = {
    id: id,
    data: data
  };
  const folder = req.params.id;
  const [allfiles] = await bucket.getFiles({ prefix: `${collectionName}/${folder}/` });
  const files = [];
  for (const file of allfiles) {
    const [url] = await file.getSignedUrl({ action: 'read', expires: '03-17-2025' });
    files.push({downloadURL: url});
  }

  const response = {combinedData,files};
    return res.json(response)

}


const getAllDBWithSpecificAttribute = async (req, res) => {
  const collectionName = req.params.collectionName;
  const bucket = admin.storage().bucket();
  fireStore.collection(collectionName).where("speciality", "==", req.params.speciality).get()
  .then(snapshot => {
    const ids = snapshot.docs.map(doc => doc.id);
    const promises = ids.map(id => {
      return fireStore.collection(collectionName).doc(id).get()
    .then(doc => {
      return {id,data: doc.data()};
      }).then(docData => {
          return bucket.getFiles({prefix: `${collectionName}/${id}/`,})
          .then(results => {
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
    Promise.all(promises).then(results => {
    const listings = {listCollections: results,};
    if(results.length > 0) {
      successResponse.send(res, listings)
    }
    else {
        errorResponse.send(res, ["erreur"])
    }
    });
  });
};
  

const getAllDB = async (req, res) => {
  const collectionName = req.params.collectionName;
  const bucket = admin.storage().bucket();
  fireStore.collection(collectionName).get().then(snapshot => {
  const ids = snapshot.docs.map(doc => doc.id);
    const promises = ids.map(id => {
      return fireStore.collection(collectionName).doc(id).get().then(doc => {
        return {id,data: doc.data(),};
      })
      .then(docData => {
        return bucket.getFiles({prefix: `${collectionName}/${id}/`,}).then(results => {
          const filePromises = results[0].map(file => {
            return file.getSignedUrl({action: 'read',expires: '03-17-2025',}).then(signedUrls => {
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
      const listings = {listCollections: results};
      if(results.length > 0) {
        successResponse.send(res, listings)
      }
      else {
        errorResponse.send(res, ["erreur"])
      }
    });
  });
};

module.exports = {addDB, deleteDB, updateDB, getAllDB, getOneDBWithFileDetails, getAllDBWithSpecificAttribute}