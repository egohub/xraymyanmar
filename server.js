const express = require('express');
const Xray = require('x-ray');
const cors = require('cors');
const mongoose = require("mongoose");
const Movies = require("./models/movies");
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static((__dirname, 'public')));

var mainRoutes = require('./router/main');
app.use(mainRoutes);

var port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('The party is on at port ' + port);
});
