const firebase = require("../../config/db");
const fireStore = firebase.firestore();
const firebasee = require('firebase');
const { getAuth } = require('firebase-admin/auth');
const { successResponse, errorNotFound, errorResponse } = require("../../config/response");
const getListUsers = (req, res) => {
  var _users_list = [];
  getAuth().listUsers(1000).then((listUsersResult) => {
    _users_list = listUsersResult.users;
    successResponse.send(res, _users_list)
    if (listUsersResult.pageToken) {
      listAllUsers(listUsersResult.pageToken);
  }})
  .catch((error) => {
    errorResponse.send(res, error.message)
  });
};

const deleteAllUsers = (req, res) => {
  let uids = []
  getAuth().listUsers(1000).then((listUsersResult) => {
    uids = uids.concat(listUsersResult.users.map((userRecord) => userRecord.uid))
    if (listUsersResult.pageToken) {
      deleteAllUsers(listUsersResult.pageToken);
    }})
  .catch((error) => {
    console.log('Error listing users:', error);})
  .finally(() => {
    getAuth().deleteUsers(uids)
})};

const getUserInfos = async (req, res) => {
  getAuth().getUser(req.params.uid).then((userRecord) => {
    successResponse.send(res, [userRecord])
  })
  .catch((error) => {
    errorResponse.send(res, error.message)
  });};

const getUserRole = async (req, res) => {
  getAuth().getUser(req.params.uid).then(async (userRecord) => {
    const user = await fireStore.collection("users").doc(req.params.uid);
    const data = await user.get();
    if (!data.exists) {
      errorNotFound.send(res,"Record not found")
    } else {
      const obj2 = JSON.parse(JSON.stringify(userRecord));
      const obj3 = JSON.parse(JSON.stringify(data.data()));
      const mergedObj = Object.assign(obj2,obj3);
      const jsonStr = JSON.stringify(mergedObj);
      const result = JSON.parse(jsonStr);
      successResponse.send(res, [result["role"]])
    }})
  .catch((error) => {
    errorResponse.send(res, error.message )
  });};

const updateUserinfos = async (req, res) => {
  getAuth().updateUser(req.params.uid, {email: req.body.email,password: req.body.password,displayName: req.body.displayName,photoURL: req.body.photoURL,})
  .then((userRecord) => {
    console.log(JSON.stringify(userRecord))
    successResponse.send(res, "Successfully updated user")
  })
  .catch((error) => {
    errorResponse.send(res, error.message )
  });};

const updateUserpassword = async (req, res) => {
  const user = firebase.auth().currentUser;
  user.updatePassword(req.body.password).then(() => {
    successResponse.send(res, "Successfully updated user")
  }).catch((error) => {
    errorResponse.send(res, error.message )
  });};

const deleteOneUser = async (req, res) => {
  getAuth().deleteUser(req.params.uid).then(async () => {
    await fireStore.collection("users").doc(req.params.uid).delete();
    successResponse.send(res, "Successfully deleted user")
  })
  .catch((error) => {
    errorResponse.send(res, error.message )
  });};

const getUserInfoswithIpAdress = async (req, res) => {
  getAuth().getUser(req.params.uid).then(async (userRecord) => {
    const user = await fireStore.collection("users").doc(req.params.uid);
    const data = await user.get();
    if (!data.exists) {
      errorNotFound.send(res, "Record not found")
    } else {
      const obj2 = JSON.parse(JSON.stringify(userRecord));
      const obj3 = JSON.parse(JSON.stringify(data.data()));
      const mergedObj = Object.assign(obj2,obj3);
      const jsonStr = JSON.stringify(mergedObj);
      const result = JSON.parse(jsonStr);
      successResponse.send(res, [result])
    }
  })
  .catch((error) => {
    errorResponse.send(res, error.message )
  });};

const blockUser = async (req, res) => {
  try {
    getAuth().updateUser(req.params.uid, { disabled: true });
    successResponse.send(res, "Record updated successfully")
  } 
  catch (error) {
    errorResponse.send(res, error.message );
  }};

const restoreUser = async (req, res) => {
  try {
    getAuth().updateUser(req.params.uid, { disabled: false });
    successResponse.send(res, "Record updated successfully" )
  } catch (error) {
      errorResponse.send(res, error.message )
  }};

const getListofUsersWithRoleUser = async (req, res) => {
  getAuth().listUsers().then((listUsersResult) => {
  const uids = listUsersResult.users.map((userRecord) => userRecord.uid);
  const userDocsRef = fireStore.collection('users').where('role', '==', 'user');
  const query = userDocsRef.where(firebasee.firestore.FieldPath.documentId(), 'in', uids);
  query.get().then((querySnapshot) => {
    const users = [];
    querySnapshot.forEach((doc) => {
      const userRecord = listUsersResult.users.find((user) => user.uid === doc.id);
      if (userRecord) {
        users.push({uid: userRecord.uid,email: userRecord.email,displayName: userRecord.displayName,photoURL: userRecord.photoURL,
        ...doc.data()});
      }})
      successResponse.send(res,{users: users})
    }).catch((error) => {
      console.error(error);
    });
  }).catch((error) => {
    console.error(error);
  });}

module.exports = {getUserInfos, updateUserinfos, deleteOneUser, getListUsers, updateUserpassword, getUserInfoswithIpAdress, deleteAllUsers, blockUser, restoreUser, getUserRole, getListofUsersWithRoleUser}