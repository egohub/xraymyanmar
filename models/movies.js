const mongoose = require("mongoose");
const findOrCreate = require('mongoose-find-or-create')

// const url = process.env.WIZDOMDB || "mongodb://localhost/wizdom";
var url = 'mongodb://database:database7@ds251618.mlab.com:51618/movies';

mongoose.connect(url , { useNewUrlParser: true , useUnifiedTopology: true});


const moviesSchema = new mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  ids: String,
  title: {type:String, required: true},
  text: String,
  rate: String,
  director: String,
  actor : String,
  image : {type:String, required: true},
  categories : String,
  posts : []
});

moviesSchema.plugin(findOrCreate, { appendToArray: true, saveOptions: { validateBeforeSave: true } })

module.exports = mongoose.model("Movies", moviesSchema);
