const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config/config");
routes = require("./routes")
const app = express();
app.use(express.json());
app.use(cors());
routes(app); 
app.use(bodyParser.json());
app.listen(config.port, () => { console.log("Service endpoint= %s", config.url);});