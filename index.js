const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config");
const UserRoutes = require("./routes/user-routes");
const notifRoutes = require("./routes/notifications-routes");
const filesRoutes = require("./routes/files-routes");
const mailingRoutes = require("./routes/mail-routes");
const messagingRoutes = require("./routes/live-chat-routes");
const rateLimit = require('express-rate-limit');
const postsRoutes = require("./routes/all-posts-routes");
const savedPostRoutes = require("./routes/all-saved-posts-routes");
const sharedPostRoutes = require("./routes/all-shared-posts-routes");
const DataBaseCollectionRoutes = require("./routes/listing-directory-routes");
var limiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 15,
});

const app = express(); 
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//Routes
app.use("/api", UserRoutes.routes);
app.use("/api", notifRoutes.routes);
app.use("/api", filesRoutes.routes);
app.use("/api", mailingRoutes.routes);
app.use("/api", messagingRoutes.routes);
app.use("/api", postsRoutes.routes);
app.use("/api", savedPostRoutes.routes);
app.use("/api", sharedPostRoutes.routes);
app.use("/api", DataBaseCollectionRoutes.routes);
app.listen(config.port, () => {
  console.log("Service endpoint= %s", config.url);
});