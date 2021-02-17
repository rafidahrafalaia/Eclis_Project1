require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const config = require('./config')
const app = express();
const CRUDRoute = require('./Router/routeCRUD')
const AuthRoute = require('./Router/routeAuth')
const SSORoute = require('./Router/routeSSO')
const db = require("./database/connection");

app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true
}));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api",AuthRoute,CRUDRoute)
app.use(SSORoute)

db.sequelize.sync(
  // {
  //   force: true
  // }
).then(() => {
  console.log("re-sync db.");
});

app.listen(3001, () => {
  console.log("running server");
});