
class Post {
    constructor(id, title, contenu,date, visibility,uid, uname, uphoto) {
      this.id = id; 
      this.title = title;
      this.contenu = contenu;
      this.date = date;
      this.uid = uid; 
      this.uname = uname;
      this.uphoto = uphoto;
      this.visibility= visibility;
    }
  }
   
  module.exports = Post;