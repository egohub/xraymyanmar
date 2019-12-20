var express = require('express');
var Xray = require('x-ray');
var app = express();
const mongoose = require("mongoose");
const Movies = require("./models/movies");

app.use(express.static((__dirname, 'public')));

var x = Xray({
  filters: {
    remove: function (value) {

      return typeof value === 'string' ? value.replace("var _ase = _ase || []; /* load placement for account: channelmyanmar, site: channelmyanmar.org, zone size : 320x50 */ _ase.push(['1529309874','1564385425']);", "p") : value
    },
    trim: function (value) {
      return typeof value === 'string' ? value.trim() : value
    },
    replace: function (value) {
      return typeof value === 'string' ? value.replace("mt-", "") : value
    },
    embed: function (value) {
      return typeof value === 'string' ? value.startsWith('https://mirrorace.com/m/')  : value
    },
    slice: function (value, start, end) {
      return typeof value === 'string' ? value.slice(start, end) : value
    },
    href: function (value) {
      return typeof value === 'string' ? 'https://channelmyanmar.org/?p=' + value : value
    },
    repid: function (value) {
      return typeof value === 'string' ? value.replace("https://channelmyanmar.org/?p=", "") : value
  },
    heroku: function (value) {
      return typeof value === 'string' ? 'https://xraymm.herokuapp.com/movie/' + value : value
    }
  }
})
app.get('/movies', function (req, res) {
  var stream = x('https://channelmyanmar.org/movies', 'div.item_1 .item', [
    {
      id: '@id | replace',
      image: '.image img@src',
      title: 'h2',
      link: 'a@href',
      url: '@id | replace | href',
      movielink: '@id | replace| heroku',
      content: '.ttx | trim'
    }
  ])
    .paginate('.larger@href')
    .limit(5)
    .stream()
  stream.pipe(res)
})
/*
 .then(function(res) {
   console.log(res) // prints first result
 })
 .catch(function(err) {
   console.log(err) // handle error in promise
 })
 */
app.get('/:id', function (req, res) {
  var id = req.params.id
  var stream = x('https://channelmyanmar.org/?p=' + id, {
    title: 'title',
    text: '#cap1',
    rate: '.imdb_r .a span',
    director: '.meta_dd a',
    actor: '.meta_dd.limpiar',
    image: '.fix img@src',
    downloadUrl: '.elemento a@href ',
    posts: x('.elemento', [{
      //downloads : [ 'a@href'],
      site: '.b | trim',
      download: 'a@href',
      quality: '.d',
      size: ' .c'
    }])
  }).stream()
  stream.pipe(res)
})
/* 
 (function (err, obj) {
     console.log(err, obj)
   })
*/
app.get('/movie', function (req, res) {
  var stream = x('https://channelmyanmar.org/movies', {
    //id: '.item_1 .item@id',
    links: x('.item .boxinfo', [{
      text: 'a',
      href: 'a@href',
      id: href.length,
      posts: x('a@href', {

        title: 'h1',
        image: '.fix img@src',
        download: ['.elemento a@href']
        //link : '.elemento a@href'
      })
    }])
  }).stream()
  stream.pipe(res)

  (function (err, obj) {
    console.log(err, obj)
  })
})
app.get('/movie/page/:id', function (req, res) {
  var id = req.params.id;
  var stream = x('https://channelmyanmar.org/movies/page/' + id, {
    //title: 'title',
    links: x('.item_1 .item', [{
      id: '@id | trim',
      img: '.image img@src',
      href: 'a@href',
      posts: x('a@href', {
        title: 'h1',
        image: '.fix img@src',
        content: '#cap1',
        download: ['.elemento a@href']
        //link : '.elemento a@href'
      })
    }])
  }).stream()
  stream.pipe(res)
});

const xmovie = (item) => {
  x('https://channelmyanmar.org/?p=' + item, {
    ids: 'link[rel="shortlink"]@href | repid',
    title: 'title',
    text: '#cap1 | trim',
    rate: '.imdb_r .a span',
    director: '.meta_dd a',
    actor: '.meta_dd.limpiar',
    image: '.fix img@src',
    downloadUrl: '.elemento a@href',
    posts: x('.elemento', [{
      //downloads : [ 'a@href'],
      site: '.b | trim',
      download: 'a@href',
      quality: '.d',
      size: ' .c'
    }])
  })
}
app.get('/movie/:id', function (req, res) {
  var id = req.params.id;
  Movies.find({ ids: id }, (err, resp) => {
    if (err) {
      throw err
    } else {
      if (resp < 1) {
        console.log('No Fount :( !! But We start Scrape Now Sir')
        var stream = x('https://channelmyanmar.org/?p=' + id, {
          ids: 'link[rel="shortlink"]@href | repid',
          title: 'title',
          text: '#cap1 | trim',
          rate: '.imdb_r .a span',
          director: '.meta_dd a',
          actor: '.meta_dd.limpiar',
          image: '.fix img@src',
          categories: 'p.meta i.limpiar a',
          posts: x('.elemento', [{
            //downloads : [ 'a@href'],
            site: '.b | trim',
            download: 'a@href',
            quality: '.d',
            size: ' .c'
          }])
        })(function (err, obj) {
        //  console.log(err, obj)
        Movies.findOrCreate(obj,{ appendToArray: true }, (err, result) => {
          console.log('WE ADDED  DATABAS');
          res.send(result);
        })
          var movie = new Movies()
 
              // res.send(obj)
        })
      }
      else {
        res.send(resp)
        console.log('Already Saved!')
      }
    }
  })

})

var port = process.env.PORT || 3000;

// app.listen(3000);
app.listen(port, () => {
  console.log('The party is on at port ' + port);
});
