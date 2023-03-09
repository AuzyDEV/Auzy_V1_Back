const firebase = require("../db");
const Medecine = require("../models/medecine");
const fireStore = firebase.firestore();
const admin = require('firebase-admin');

const addMedecine = async (req, res, next) => {
    try {
      console.log("Adding new Medecine");
      await fireStore.collection("medecines").add(
      { 
          name: req.body.name,
          type: req.body.type,
          desciption: req.body.desciption,
          productionDate: new Date(req.body.productionDate),
          expDate: new Date(req.body.expDate)

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
  }
  const getOneMedecineWithFileDetails  = async (req, res, next)=> {
    const bucket = admin.storage().bucket();
    const document = fireStore.collection("medecines").doc(req.params.id);
    const documentSnapshot = await document.get();
    const data = documentSnapshot.data();
  
    // Get the corresponding files from Firebase Storage
    const folder = req.params.id;
    const [allfiles] = await bucket.getFiles({ prefix: `medecines/${folder}/` });
  
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
  const getAllAvailablesMedecines = async (req, res, next) => {
    const sysDate  = new Date();
   // fireStore.collection("medecines").where("expDate", ">", sysDate)
   const bucket = admin.storage().bucket();
   fireStore.collection("medecines").where("expDate", ">", sysDate).get().then(snapshot => {
    const ids = snapshot.docs.map(doc => doc.id);
  
    // Use the IDs to find the corresponding folders in Firebase Storage
    const promises = ids.map(id => {
      return fireStore.collection('medecines').doc(id).get().then(doc => {
        return {
          id,
          data: doc.data(),
        };
      }).then(docData => {
        return bucket.getFiles({
          prefix: `medecines/${id}/`,
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
        medecines: results,
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
 
  const getAllNotAvailablesMedecines = async (req, res, next) => {
    const sysDate  = new Date();
    const bucket = admin.storage().bucket();
    fireStore.collection("medecines").where("expDate", "<", sysDate).get().then(snapshot => {
    const ids = snapshot.docs.map(doc => doc.id);
  
    // Use the IDs to find the corresponding folders in Firebase Storage
    const promises = ids.map(id => {
      return fireStore.collection('medecines').doc(id).get().then(doc => {
        return {
          id,
          data: doc.data(),
        };
      }).then(docData => {
        return bucket.getFiles({
          prefix: `medecines/${id}/`,
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
        medecines: results,
      };
      if(results.length > 0){
        res.status(200).json(data)
      }
      else {
        res.status(400).json(["erreur"])
      }
    });
  });
    
  };
  const deleteMedecine = async (req, res, next) => {
    const bucket = admin.storage().bucket();
    try {
      const folder = req.params.id;
      await fireStore.collection("medecines").doc(req.params.id).delete();
      const [allfiles] = await bucket.getFiles({ prefix: folder });
      for (const file of allfiles) {
      await file.delete();
    }
      res.status(200).json({ message: "medecine deleted successfully" });
    } catch (error) {
      
      res.status(400).json({ message: error.message });
    }
  };
  const updateMedecine = async (req, res, next) => {
    try {
      const post = await fireStore.collection("medecines").doc(req.params.id);
      await post.update(
          {
            name: req.body.name,
            type: req.body.type,
            desciption: req.body.desciption,
            productionDate: new Date(req.body.productionDate),
            expDate: new Date(req.body.expDate)
  
      });
      res.status(200).json({ message: "Record updated successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


  module.exports = {
  addMedecine,
  getAllAvailablesMedecines,
  getAllNotAvailablesMedecines,
  deleteMedecine,
  updateMedecine,
  getOneMedecineWithFileDetails
  }