const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config/config");
const userProfilRoutes = require("./user-profile/user-profile-routes");
const notifRoutes = require("./notifications/notifications-routes");
const filesRoutes = require("./files-functions/files-functions-routes");
const mailingRoutes = require("./contact-us/contact-us-routes");
const messagingRoutes = require("./live-chat/live-chat-routes");
const postsRoutes = require("./social-post/posts/posts-routes");
const savedPostRoutes = require("./social-post/saved-posts/saved-posts-routes");
const sharedPostRoutes = require("./social-post/share-post/share-post-routes");
const DataBaseCollectionRoutes = require("./listing-directory/listing-directory-routes");
const mailborodcastRoutes = require("./admin-functions/mail-broadcast/mail-broadcast-routes")
const postManRoutes = require("./admin-functions/post-management/post-management-routes")
const UserManRoutes = require("./admin-functions/user-management/user-management-routes")
const loginRoutes = require("./authentification/login/login-routes")
const createaccountRoutes = require("./authentification/create-account/create-account-routes")

const app = express(); 
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use("/api", mailborodcastRoutes.routes);
app.use("/api", postManRoutes.routes);
app.use("/api", UserManRoutes.routes);
app.use("/api", loginRoutes.routes);
app.use("/api", createaccountRoutes.routes);
app.use("/api", postsRoutes.routes);
app.use("/api", savedPostRoutes.routes);
app.use("/api", sharedPostRoutes.routes);
app.use("/api", DataBaseCollectionRoutes.routes);
app.use("/api", notifRoutes.routes);
app.use("/api", userProfilRoutes.routes);
app.use("/api", filesRoutes.routes);
app.use("/api", mailingRoutes.routes);
app.use("/api", messagingRoutes.routes);


app.listen(config.port, () => {
  console.log("Service endpoint= %s", config.url);
});