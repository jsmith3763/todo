require("dotenv").config();
const express = require("express");
const db = require("./database/conn")
const app = express();
const { response } = require("express");
const { json } = require("body-parser");

const PORT = proccess.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

