const firebase = require("../db");
const User  = require("../models/user-model");
const fireStore = firebase.firestore();
const firebasee = require('firebase');
const { getAuth, UserRecord } = require('firebase-admin/auth');
const requestIp = require('request-ip');

let users = [];

const addUser = async (req, res, next) => {
  try {
    await fireStore.collection("users").doc(req.body.uid)
    .set({
        ipadress: req.body.ipadress,
      }
      );
    res.status(201).json({ message: "Record saved successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    console.log("Getting all users");
    const users = await fireStore.collection("users");
    const data = await users.get();
    const arr = [];
    if (data.empty) {
      res.status(200).json({ message: "No records found" });
    } else {
      let total = 0;
      data.forEach((item) => {
        const user = new User(
          item.id,
          item.data().fullName,
          item.data().email,
        );
        arr.push(user);
        total = total + 1;
      });
      res.status(200).json({
        listing: arr,
        count: total
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUser = async (req, res, next) => {
  try {
    console.log("Getting user= %s", req.params.id);
    const user = await fireStore.collection("users").doc(req.params.id);
    const data = await user.get();
    if (!data.exists) {
      res.status(404).json({ message: "Record not found" });
    } else {
      res.status(200).json(data.data());
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res, next) => {
  try {
    console.log("Updating user= %s", req.params.id);
    const user = await fireStore.collection("users").doc(req.params.id);
    await user.update(req.body);
    res.status(200).json({ message: "Record updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    console.log("Deleting user= %s", req.params.id);
    await fireStore.collection("users").doc(req.params.id).delete();
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const signUp = async (req, res, next) => {
  firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
  .then((userCredential) => {
    var user = userCredential.user;
    console.log(user.uid)
    user.sendEmailVerification().then(() => {
       fireStore.collection("users").doc(user.uid)
    .set({
        ipadress: req.body.ipadress,
        role: "user"
      })
      getAuth()
      .updateUser(user.uid, {
        displayName: req.body.displayName,
        photoURL: req.body.photoURL,
      })
      .then((userRecord) => {
        console.log(JSON.stringify(userRecord))
        
      res.status(200).json({ message: "User registred & email send successfully" });
      })
      .catch((error) => {
        res.status(400).json({ message: error.message});
      });
    }).catch((error) => {
        res.status(401).json({ message: error.message });
    });
  }).catch((error) => {
    if (error.code === 'auth/email-already-in-use')
      res.status(400).json({ message: error.message });
    else
      res.status(500).json({ message: error.message });
  });
}

const login = async (req, res, next) => {
  firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
  .then(async (userCredential) => {
  var user = userCredential.user;
  firebase.auth().onAuthStateChanged(
    async function(user) {
      if(user.emailVerified == true){
        console.log("email confirmation")
        token = await userCredential.user.getIdToken();
        console.log(token)
        res.status(200).json({ message: "User signin successfully", data: token });
    }
    else {
      res.status(404).json({ message: "no confirmation email" });
    }
    })
  })
  .catch((error) => {
  if (error.code === 'auth/user-not-found')
    res.status(400).json({ message: error.message });
    else
    res.status(500).json({ message: error.message });
  });
}

const logout = async (req, res, next) => {
  firebase.auth().signOut().then(() => {
    res.status(200).json({ message: "User logout successfully" });
    }).catch((error) => {
      res.status(400).json({ message:  error.message });
    });
}

const signInWithGoogle = async (req, res, next) => {
  var provider = new firebasee.auth.GoogleAuthProvider();
  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    res.status(200).json({ message: "User signin google successfully" });
  }).catch((error) => {
    res.status(400).json({ message: error.message});
  });
}

const signInWithFacebook = async (req, res, next) => {
  var provider = new firebasee.auth.FacebookAuthProvider();
  firebase
  .auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
    // The signed-in user info.
    var user = result.user;
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;
    res.status(200).json({ message: "User signin facebook successfully" });
  }) .catch((error) => {
    res.status(400).json({ message: error.message});
  });
}

const sendResetEmail = async (req, res, next) => {
  firebase.auth().sendPasswordResetEmail(req.body.email).then(() => { 
    res.status(200).json({ message: "email reset password send!" });
    }).catch((error) => {
        res.status(400).json({ message: error.message});
    });}

const sendVerificationEmail = async (req, res, next) => {
  const user = firebase.auth().currentUser;
  user.sendEmailVerification().then(() => { 
    res.status(200).json({ message: "email adress confirmation send!" });
    }).catch((error) => {
    res.status(400).json({ message: error.message });
    });
}
const getCurrentUser = async (req, res, next) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var uid = user.uid;
      res.status(200).json([user]);
    } else {
      res.status(400).json({ message: "User is signed out" });
    }
  });
}
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


 async function countUsers(count) {
  const listUsersResult = await getAuth().listUsers(1000);
  listUsersResult.users.map(user => {
    if (new Date(user.metadata.creationTime) < new Date("2023-01-12T00:00:00")) {
      count++;
    }});
  if (listUsersResult.pageToken) {
    count = await countUsers(count, listUsersResult.pageToken);
  }
  return count;}

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


const getUserwWithEmail = async (req, res, next) => {
  console.log("Getting user= %s", req.params.email);
  getAuth()
  .getUserByEmail(req.params.email)
  .then((userRecord) => {
    res.status(200).json({ message: [userRecord.uid, userRecord.email] });
      })
  .catch((error) => {
        res.status(400).json({ message: error.message});
      });
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
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    signUp,
    login,
    logout,
    signInWithGoogle,
    signInWithFacebook,
    sendResetEmail,
    sendVerificationEmail,
    getUserwWithEmail,
    getUserInfos,
    updateUserinfos,
    deleteOneUser,
    getListUsers,
    getCurrentUser,
    updateUserpassword,
    getUserInfoswithIpAdress,
    deleteAllUsers,
    blockUser,
    restoreUser,
    countUsers,
    getUserRole,
    getListofUsersWithRoleUser
  }