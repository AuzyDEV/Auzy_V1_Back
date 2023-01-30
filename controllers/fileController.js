const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const functions = require('firebase-functions')
const firebase = require("../db");
const storagee = require('@google-cloud/storage');
const storage = firebase.storage().ref();
require("firebase/storage");
global.XMLHttpRequest = require("xhr2");
let khra = [];

const storageClient = new storagee.Storage();

const addFile1 = async (req, res) => {
  var  metadata= {
    contentType: 'image/jpeg',
    customMetadata: {
      'uid': req.body.uid,
    }
  };
  try {
      // Grab the file
      const file = req.file;
      // Format the filename
      const timestamp = Date.now();
      const name = file.originalname.split(".")[0];
      const type = file.originalname.split(".")[1];
      const fileName = `${name}_${timestamp}.${type}`;
       // Step 1. Create reference for file name in cloud storage 
      const imageRef = storage.child(fileName);
      // Step 2. Upload the file in the bucket storage
      const snapshot = await imageRef.put(file.buffer,metadata);
      // Step 3. Grab the public url
      const downloadURL = await snapshot.ref.getDownloadURL();
      //console.log(snapshot.metadata['uid']);
      
      res.send(downloadURL);
   }  catch (error) {
      console.log (error)
      res.status(400).send(error.message);
  }
}

const addFile2 = async (req, res, next) => {
  const bucket = admin.storage().bucket();// file that you want to send
const file = req.file;
const fileUpload = bucket.file(file);
var  metadata= {
  contentType: 'image/jpeg'
};
await bucket.upload(file.originalname, {
  // Support for HTTP requests made with `Accept-Encoding: gzip`
  gzip: true,
  metadata: metadata,
});
/*const stream = fileUpload.createWriteStream({
    metadata: {
        contentType: 'image/jpeg'
    }
});*/
/*
stream.on('error', (err) => {
    console.log(err);
});

stream.on('finish', () => {
    fileUpload.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    })
    .then((signedUrls) => {
        // you can use this url to send message and user can download the file
        console.log(signedUrls[0]);
    });
});

stream.end(file);
  */
}

const downloadFile = async (req, res, next) => {
 // Create a reference to the file we want to download
var name= req.body.name
console.log(name)
var starsRef = storage.child(req.body.fileName);
// Get the download URL
starsRef.getDownloadURL()
.then((url) => {
  res.status(200).json({url : url})
  // Insert url into an <img> tag to "download"
})
.catch((error) => {
  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
  switch (error.code) {
    case 'storage/object-not-found':
      // File doesn't exist
      break;
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;
    case 'storage/canceled':
      // User canceled the upload
      break;

    // ...

    case 'storage/unknown':
      // Unknown error occurred, inspect the server response
      break;
  }
});
}

const deleteFile = async (req, res, next) => {
    // Create a reference to the file to delete
var desertRef = storage.child(req.params.fileName);
// Delete the file
desertRef.delete().then(() => {
  // File deleted successfully
  res.status(200).json({ message: "file deleted successfully" })
}).catch((error) => {
  // Uh-oh, an error occurred!
  res.status(400).json({ message: error.message });
});
};

const getAllFiltedFilesByUserid = async (req, res, next) => {
  var file;
  let listfiles = [];
  const bucket = admin.storage().bucket();
  bucket.getFiles()
  .then(results => {
      const files = results[0];
      files.filter(file => {
    return file.metadata.metadata.uid === req.params.uid

  }).forEach(file => {
    file.getSignedUrl({
            action: "read",
            expires: "03-09-2491"
        }).then(data => {
          console.log(data)
          listfiles.push({name: file.name, downloadURL: data[0]});
        }).then(() => {
          res.status(200).send(listfiles)
        })});
 
})
  .catch(error => {
          res.status(400).send({message: error.message})
      });
 }
/*
 async function getFilesUrls() {
 const bucketName= "gs://myfirstapp-72a20.appspot.com"
  const filter = 'metadata.customMetadata.category = images';
  let files = await admin.storage().bucket(bucketName).getFiles({ filter });
  let filesUrls = {};
  for (let file of files[0]) {
      const fileUrl = await file.getSignedUrl({
              action: 'read',
              expires: '03-09-2491',
          });
      filesUrls[file.name] = fileUrl[0];
  }
  return filesUrls;
}

getFilesUrls()
  .then((filesUrls) => {
      console.log(filesUrls);
  })
  .catch((error) => {
      console.error(error);
  });
*/

const getOnefile = async (req, res, next) => {
  admin.storage().bucket()
    .file(req.params.name)
    .getMetadata()
    .then(metadata => {
      res.json(metadata);
    })
    .catch(err => {
      res.status(404).json({ error: 'File not found' });
    });
 }





/*
getFilesUrls()
  .then((filesUrls) => {
      console.log(filesUrls);
  })
  .catch((error) => {
      console.error(error);
  });
*/
module.exports = {
    addFile1,
    addFile2,
    downloadFile,
    deleteFile,
    getAllFiltedFilesByUserid,
    getOnefile
  }