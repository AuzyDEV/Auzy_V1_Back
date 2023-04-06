const firebase = require("../db");
const fireStore = firebase.firestore();
const admin = require('firebase-admin');

const addDB = async (req, res, next) => {
    try {
        const { collectionName, ...data } = req.body;
        await fireStore.collection(req.body.collectionName).add(data).then(docRef => {
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
        res.status(404).json(error);
    }
  }

const deleteDB = async (req, res, next) => {
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
    }
  };
const updateDB = async (req, res, next) => {
    try {
        const { collectionName, ...data } = req.body;
        const post = await fireStore.collection(req.body.collectionName).doc(req.params.id);
        await post.update(data);
    res.status(200).json({ message: "Record updated successfully" });
    } catch (error) {

        res.status(400).json({ message: error.message });
    }
};

const getOneDBWithFileDetails  = async (req, res, next)=> {
    const collectionName = req.params.collectionName;
    const bucket = admin.storage().bucket();
    const document = fireStore.collection(collectionName).doc(req.params.id);
    const documentSnapshot = await document.get();
    const data = documentSnapshot.data();
  
    // Get the corresponding files from Firebase Storage
    const folder = req.params.id;
    const [allfiles] = await bucket.getFiles({ prefix: `${collectionName}/${folder}/` });
  
    // Create an array to store the download URLs of the files
    const files = [];
    for (const file of allfiles) {
      const [url] = await file.getSignedUrl({ action: 'read', expires: '03-17-2025' });
      files.push({downloadURL: url});
    }
  
    // Combine the document data and file URLs into a single response object
    const response = {
      data,
      files
    };
  
    // Return the response as a JSON string
    return res.json(response)
    //return JSON.stringify(response);
  
  }
  const getAllDBWithSpecificAttribute = async (req, res, next) => {
    const collectionName = req.params.collectionName;
    const bucket = admin.storage().bucket();
    fireStore.collection(collectionName).where("speciality", "==", req.params.speciality).get().then(snapshot => {
     const ids = snapshot.docs.map(doc => doc.id);
   
     // Use the IDs to find the corresponding folders in Firebase Storage
     const promises = ids.map(id => {
       return fireStore.collection(collectionName).doc(id).get().then(doc => {
         return {
           id,
           data: doc.data(),
         };
       }).then(docData => {
         return bucket.getFiles({
           prefix: `${collectionName}/${id}/`,
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
         listCollections: results,
       };
       if(results.length > 0) {
         res.status(200).json(data)
       }
       else {
         res.status(400).json(["erreur"])
       }
       //fs.writeFileSync('./res.json', JSON.stringify(data));
     });
   });
   };
  

const getAllDB = async (req, res, next) => {
   const collectionName = req.params.collectionName;
   const bucket = admin.storage().bucket();
   fireStore.collection(collectionName).get().then(snapshot => {
    const ids = snapshot.docs.map(doc => doc.id);
  
    // Use the IDs to find the corresponding folders in Firebase Storage
    const promises = ids.map(id => {
      return fireStore.collection(collectionName).doc(id).get().then(doc => {
        return {
          id,
          data: doc.data(),
        };
      }).then(docData => {
        return bucket.getFiles({
          prefix: `${collectionName}/${id}/`,
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
        listCollections: results,
      };
      if(results.length > 0) {
        res.status(200).json(data)
      }
      else {
        res.status(400).json(["erreur"])
      }
      //fs.writeFileSync('./res.json', JSON.stringify(data));
    });
  });
  };

  module.exports = {
    addDB,
    deleteDB,
    updateDB,
    getAllDB,
    getOneDBWithFileDetails,
    getAllDBWithSpecificAttribute
    }