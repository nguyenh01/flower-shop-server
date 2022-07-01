const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3002;

//Require db
require("./connections/mongo.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve web
app.use(express.static(path.join(__dirname, "./web")));

// Serve public
app.use("/public", express.static(path.join(__dirname, "./public")));

// Serve api
const router = require("./router");
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  app.use("/api", router);

  next();
});

app.listen(PORT, () => {
  console.log("Server is running at port " + PORT);
});
