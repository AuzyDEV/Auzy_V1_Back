const firebase = require("../config/db");
const fireStore = firebase.firestore();
const admin = require('firebase-admin');
const addDB = async (req, res) => {
  try {
    const { collectionName, ...data } = req.body;
    await fireStore.collection(req.body.collectionName).add(data).then(docRef => {
    const response = {status: 'success',id: docRef.id};
      res.status(201).json(response);}) 
    .catch(error => {
      const response = {status: 'error',message: error.message};
      res.status(400).json(response);
      });
  } catch (error) {
    res.status(404).json(error);}
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
    res.status(200).json({ message: "DB deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }};

const updateDB = async (req, res) => {
  try {
    const { collectionName, ...data } = req.body;
    const post = await fireStore.collection(req.body.collectionName).doc(req.params.id);
    await post.update(data);
      res.status(200).json({ message: "Record updated successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }};

const getOneDBWithFileDetails  = async (req, res)=> {
  const collectionName = req.params.collectionName;
  const bucket = admin.storage().bucket();
  const document = fireStore.collection(collectionName).doc(req.params.id);
  const documentSnapshot = await document.get();
  const data = documentSnapshot.data();
  const folder = req.params.id;
  const [allfiles] = await bucket.getFiles({ prefix: `${collectionName}/${folder}/` });
  const files = [];
  for (const file of allfiles) {
    const [url] = await file.getSignedUrl({ action: 'read', expires: '03-17-2025' });
    files.push({downloadURL: url});
  }
  const response = {data,files};
    return res.json(response)
}

const getAllDBWithSpecificAttribute = async (req, res) => {
  const collectionName = req.params.collectionName;
  const bucket = admin.storage().bucket();
  fireStore.collection(collectionName).where("speciality", "==", req.params.speciality).get().then(snapshot => {
  const ids = snapshot.docs.map(doc => doc.id);
  const promises = ids.map(id => {
    return fireStore.collection(collectionName).doc(id).get()
    .then(doc => {
      return {id,data: doc.data(),};}).then(docData => {
        return bucket.getFiles({prefix: `${collectionName}/${id}/`,})
        .then(results => {
          const filePromises = results[0].map(file => {
            return file.getSignedUrl({action: 'read',expires: '03-17-2025',})
            .then(signedUrls => {
               return {name: file.name, downloadURL: signedUrls[0]};
             });
          });
        return Promise.all(filePromises).then(files => {
          return {...docData, files};});
        });
      });
    });
  Promise.all(promises).then(results => {
    const data = {listCollections: results,};
      if(results.length > 0) {
        res.status(200).json(data)
      }
      else {
        res.status(400).json(["erreur"])
      }
  });});};
  
const getAllDB = async (req, res) => {
  const collectionName = req.params.collectionName;
  const bucket = admin.storage().bucket();
  fireStore.collection(collectionName).get().then(snapshot => {
  const ids = snapshot.docs.map(doc => doc.id);
  const promises = ids.map(id => {
    return fireStore.collection(collectionName).doc(id).get().then(doc => {
    return {id,data: doc.data(),};})
    .then(docData => {
      return bucket.getFiles({prefix: `${collectionName}/${id}/`,})
      .then(results => {
        const filePromises = results[0].map(file => {
          return file.getSignedUrl({action: 'read',expires: '03-17-2025',}).then(signedUrls => {
            return {name: file.name, downloadURL: signedUrls[0]};
          });
        });
      return Promise.all(filePromises).then(files => {
        return {...docData, files};});
      });});});
    Promise.all(promises).then(results => {
      const data = {listCollections: results};
      if(results.length > 0) {
        res.status(200).json(data)
      }
      else {
        res.status(400).json(["erreur"])
      }
  });});};
module.exports = {addDB, deleteDB, updateDB, getAllDB, getOneDBWithFileDetails, getAllDBWithSpecificAttribute}