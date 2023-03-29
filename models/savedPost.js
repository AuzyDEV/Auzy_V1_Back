
class savedPost {
    constructor(id, postId, postTitle, postContenu,date, uname, uphoto, currentUserId) {

      this.id = id; // represents the id generated by the firestore
      // post s infos
      this.postId= postId;
      this.postTitle = postTitle;
      this.postContenu = postContenu;
      this.date = date;
      // user s infos who creates the post => admin infos
      this.uname = uname;
      this.uphoto = uphoto;
      // current user 's id : who saved the post
      this.currentUserId = currentUserId;
    }
    
  }
   
  module.exports = savedPost;