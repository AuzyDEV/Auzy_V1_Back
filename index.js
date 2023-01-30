const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config");
const UserRoutes = require("./routes/UserRoutes");
const notifRoutes = require("./routes/notifRoutes");
const filesRoutes = require("./routes/filesRoutes");
const mailingRoutes = require("./routes/mailingRoutes");
const messagingRoutes = require("./routes/messagingRoutes");
const rateLimit = require('express-rate-limit')

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

app.listen(config.port, () => {
  console.log("Service endpoint= %s", config.url);
});