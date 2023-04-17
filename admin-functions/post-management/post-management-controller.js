const firebase = require("../../config/db");
const fireStore = firebase.firestore();
const admin = require('firebase-admin');
const Post = require("./post-management-model");
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
    const response = {status: 'success',id: docRef.id};
    res.status(201).json(response);
    }).catch(error => {
    const response = {status: 'error',message: error.message};
    res.status(400).json(response);});
  }catch (error) {
    console.log(error);}};

const getAllPosts = async (res) => {
  try {
    const posts = await fireStore.collection("posts");
    const data = await posts.get();
    const arr = [];
    if (data.empty) {
      res.status(200).json({ message: "No posts found" });
    } else {
      let total = 0;
      data.forEach((item) => {
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
      res.status(200).json(arr);}
  } catch (error) {
    res.status(400).json({ message: error.message });
  }};

const getPostById = async (req, res) => {
  try {
    const post = await fireStore.collection("posts").doc(req.params.id);
    const data = await post.get();
    if (!data.exists) {
      res.status(404).json({ message: "Record not found" });
    } else {
      res.status(200).json([data.data()]);}
  } catch (error) {
    res.status(400).json({ message: error.message });
  }};

const updatePost = async (req, res) => {
  try {
    const post = await fireStore.collection("posts").doc(req.params.id);
    await post.update( {title: req.body.title, contenu: req.body.contenu});
    res.status(200).json({ message: "Record updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }};

const updatePostVisisbilityToFalse = async (req, res) => {
  try {
    const post = await fireStore.collection("posts").doc(req.params.id);
    await post.update({visibility: false,});
    res.status(200).json({ message: "Record updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }};

const updatePostVisibilityToTrue= async (req,res) => {
  try {
    const post = await fireStore.collection("posts").doc(req.params.id);
    await  post.update({visibility: true,});
    res.status(200).json({message: "Record updated successfully"})
  } catch (error) {
    res.status(400).json({message: error.message })
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
    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }};

module.exports = {addPost, getAllPosts, getPostById, updatePost, deletePost, updatePostVisisbilityToFalse, updatePostVisibilityToTrue,}