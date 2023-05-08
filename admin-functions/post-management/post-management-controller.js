const firebase = require("../../config/db");
const fireStore = firebase.firestore();
const admin = require('firebase-admin');
const Post = require("./post-management-model");
const { succesSendRequest, errorResponse, errorNotFound, successResponse } = require("../../config/response");
const addPost = async (req, res) => {
  try {
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
    const response = {id: docRef.id};
    succesSendRequest.send(res,response)
    }).catch(error => {
      errorResponse.send(res,error.message )});
  } catch (error) {
    console.log(error);}};

const getAllPosts = async (req, res) => {
  try {
    const posts = await fireStore.collection("posts");
    const postsList = await posts.get();
    const arr = [];
    if (postsList.empty) {
      errorNotFound.send(res,"No posts found" )
    } else {
      let total = 0;
      postsList.forEach((item) => {
      const post = new Post(
        item.id,
        item.data().title,
        item.data().contenu,
        item.data().date,
        item.data().visibility,
        item.data().uid,
        item.data().uname,
        item.data().uphoto,);
        arr.push(post);
        total = total + 1;
      });
      successResponse.send(res, arr)}
  } catch (error) {
    errorResponse.send(res, error.message)
  }};

const getPostById = async (req, res) => {
  try {
    const post = await fireStore.collection("posts").doc(req.params.id);
    const postDetails = await post.get();
    if (!postDetails.exists) {
      errorNotFound.send(res, "Record not found");
    } else {
      res.status(200).json([postDetails.data()]);}
  } catch (error) {
    errorResponse.send(res, error.message)
  }};

const updatePost = async (req, res) => {
  try {
    const post = await fireStore.collection("posts").doc(req.params.id);
    await post.update( {title: req.body.title, contenu: req.body.contenu});
    successResponse.send(res, "Record updated successfully")
  } catch (error) {
    errorResponse.send(res, error.message)
  }};

const updatePostVisisbilityToFalse = async (req, res) => {
  try {
    const post = await fireStore.collection("posts").doc(req.params.id);
    await post.update({visibility: false,});
    successResponse.send(res, "Record updated successfully")
  } catch (error) {
    errorResponse.send(res, error.message)
  }};

const updatePostVisibilityToTrue= async (req,res) => {
  try {
    const post = await fireStore.collection("posts").doc(req.params.id);
    await  post.update({visibility: true,});
    successResponse.send(res, "Record updated successfully")
  } catch (error) {
    errorResponse.send(res, error.message)
  }}

const deletePost = async (req, res) => {
  const bucket = admin.storage().bucket();
  try {
    const folder = req.params.id;
    await fireStore.collection("posts").doc(req.params.id).delete();
    const [allfiles] = await bucket.getFiles({ prefix: `posts/${folder}/` });
    for (const file of allfiles) {
    await file.delete();
    }
    successResponse.send(res, "post deleted successfully")
  } catch (error) {
    errorResponse.send(res, error.message)
  }};
module.exports = {addPost, getAllPosts, getPostById, updatePost, deletePost, updatePostVisisbilityToFalse, updatePostVisibilityToTrue,}