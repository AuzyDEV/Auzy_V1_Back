const firebase = require("../../config/db");
const fireStore = firebase.firestore();
const firebasee = require('firebase');
const { getAuth, UserRecord } = require('firebase-admin/auth');
const requestIp = require('request-ip');

let users = [];

const getListUsers = (req, res) => {
  var _users_list = [];
  getAuth()
    .listUsers(1000)
    .then((listUsersResult) => {
      _users_list = listUsersResult.users;      
      console.log('user', _users_list);
      res.status(200).json(_users_list);
      if (listUsersResult.pageToken) {
        listAllUsers(listUsersResult.pageToken);
      }})
    .catch((error) => {
      res.status(400).json({ message: error.message});
    });};


const deleteAllUsers = (req, res) => {
  let uids = []
   getAuth()
    .listUsers(1000)
    .then((listUsersResult) => {
      uids = uids.concat(listUsersResult.users.map((userRecord) => userRecord.uid))
      console.log(uids)
      if (listUsersResult.pageToken) {
        deleteAllUsers(listUsersResult.pageToken);
      }})
    .catch((error) => {
      console.log('Error listing users:', error);
    }).finally(() => {
      getAuth().deleteUsers(uids)
    })
};



const getUserInfos = async (req, res, next) => {
  console.log("Getting user= %s", req.params.uid);
  getAuth()
  .getUser(req.params.uid)
  .then((userRecord) => {
    res.status(200).json([userRecord]);
  })
  .catch((error) => {
    res.status(400).json({ message: error.message});
  });
};

const getUserRole = async (req, res, next) => {
  console.log("Getting user role= %s", req.params.uid);
  getAuth()
  .getUser(req.params.uid)
  .then(async (userRecord) => {
    console.log("Getting user= %s", req.params.uid);
    const user = await fireStore.collection("users").doc(req.params.uid);
    const data = await user.get();
    if (!data.exists) {
      res.status(404).json({ message: "Record not found" });
    } else {
       const obj2 = JSON.parse(JSON.stringify(userRecord));
      const obj3 = JSON.parse(JSON.stringify(data.data()));
      const mergedObj = Object.assign(obj2,obj3);
      const jsonStr = JSON.stringify(mergedObj);
      const result = JSON.parse(jsonStr);
      res.status(200).json([result["role"]]);
    }})
  .catch((error) => {
    res.status(400).json({ message: error.message});
  });};

const updateUserinfos = async (req, res, next) => {
  getAuth()
  .updateUser(req.params.uid, {
    email: req.body.email,
    password: req.body.password,
    displayName: req.body.displayName,
    photoURL: req.body.photoURL,
  })
  .then((userRecord) => {
    console.log(JSON.stringify(userRecord))
    res.status(200).json({ message: "Successfully updated user", data: [JSON.stringify(userRecord)] });
  })
  .catch((error) => {
    res.status(400).json({ message: error.message});
  });
};

const updateUserpassword = async (req, res, next) => {
  const user = firebase.auth().currentUser;
  user.updatePassword(req.body.password).then(() => {
    res.status(200).json({ message: "Successfully updated user"});
  }).catch((error) => {
    res.status(400).json({ message: error.message});
  });};

const deleteOneUser = async (req, res, next) => {
  getAuth()
  .deleteUser(req.params.uid)
  .then(async () => {
    await fireStore.collection("users").doc(req.params.uid).delete();
    res.status(200).json({ message: "Successfully deleted user"});
  })
  .catch((error) => {
    res.status(400).json({ message: error.message});
  });
};

const getUserInfoswithIpAdress = async (req, res, next) => {
  getAuth()
  .getUser(req.params.uid)
  .then(async (userRecord) => {
    const user = await fireStore.collection("users").doc(req.params.uid);
    const data = await user.get();
    if (!data.exists) {
      res.status(404).json({ message: "Record not found" });
    } else {
       const obj2 = JSON.parse(JSON.stringify(userRecord));
      const obj3 = JSON.parse(JSON.stringify(data.data()));
      const mergedObj = Object.assign(obj2,obj3);
      const jsonStr = JSON.stringify(mergedObj);
      const result = JSON.parse(jsonStr);
      res.status(200).json([result]);
    }
  })
  .catch((error) => {
    res.status(400).json({ message: error.message});
  });};

const blockUser = async (req, res, next) => {
  try {
    getAuth()
      .updateUser(req.params.uid, { disabled: true });
    res.status(200).json({ message: "Record updated successfully" });
  } 
  catch (error) {
    res.status(400).json({ message: error.message });}};

const restoreUser = async (req, res, next) => {
  try {
    getAuth()
    .updateUser(req.params.uid, { disabled: false });
    res.status(200).json({ message: "Record updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getListofUsersWithRoleUser = async (req, res, next ) => {
  getAuth().listUsers().then((listUsersResult) => {
    const uids = listUsersResult.users.map((userRecord) => userRecord.uid);
    const userDocsRef = fireStore.collection('users').where('role', '==', 'user');
    const query = userDocsRef.where(firebasee.firestore.FieldPath.documentId(), 'in', uids);
    query.get().then((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        const userRecord = listUsersResult.users.find((user) => user.uid === doc.id);
        if (userRecord) {
          users.push({
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            photoURL: userRecord.photoURL,
            ...doc.data()
          });
        }
      })
      res.json({users: users});
    }).catch((error) => {
      console.error(error);
    });
  }).catch((error) => {
    console.error(error);
  });
}

module.exports = {
    getUserInfos,
    updateUserinfos,
    deleteOneUser,
    getListUsers,
    updateUserpassword,
    getUserInfoswithIpAdress,
    deleteAllUsers,
    blockUser,
    restoreUser,
    getUserRole,
    getListofUsersWithRoleUser
  }