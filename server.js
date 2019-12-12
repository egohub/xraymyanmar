var express =require('express');
var Xray = require('x-ray');
var app = express();

var x = Xray({
  filters: {
    
      trim: function(value) {
        return typeof value === 'string' ? value.trim() : value
      },
    replace: function(value) {
      return typeof value === 'string' ? value.replace("mt-", "") : value
    },
    reverse: function(value) {
      return typeof value === 'string'
        ? value
            .split('')
            .reverse()
            .join('')
        : value
    },
    slice: function(value, start, end) {
      return typeof value === 'string' ? value.slice(start, end) : value
    },
    href : function (value) {
       return typeof value === 'string' ? 'https://channelmyanmar.org/?p='+ value : value
    },
    heroku : function (value) {
      return typeof value === 'string' ? 'http://localhost:8081/'+ value : value
   }
  }
})
app.get('/', function (req, res) {
    var stream = x('https://channelmyanmar.org/movies', 'div.item_1 .item', [
      {
        id : '@id | replace',
        image : '.image img@src',
        title: 'h2',
        link : 'a@href',
        url : '@id | replace | href',
        movielink : '@id | replace| heroku',
        content : '.ttx | trim'
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
    var stream = x('https://channelmyanmar.org/?p='+id, {
           title: 'title',
           text : '#cap1',
           image : '.fix img@src',
           downloadUrl: '.elemento a@href',
            posts: x('.elemento', [{
              //downloads : [ 'a@href'],
              download: 'a@href'
              //link : '.elemento a@href'
            }])
          }).stream()
          stream.pipe(res)
          })
      /* 
       (function (err, obj) {
           console.log(err, obj)
         })
    */
app.get('/movie', function(req, res) {
   var stream = x('https://channelmyanmar.org/movies', {
      //id: '.item_1 .item@id',
      links: x('.item .boxinfo', [{
        text: 'a',
        href: 'a@href',
        id : href.length,
        posts: x('a@href', {

          title: 'h1',
          image: '.fix img@src',
          download: ['.elemento a@href']
          //link : '.elemento a@href'
        })
      }])
    }).stream()
    stream.pipe(res)
    
    // (function (err, obj) {
    //   console.log(err, obj)
    // })
 })
app.get('/movie/page/:id', function(req, res) {
    var id = req.params.id;
  var stream = x('https://channelmyanmar.org/movies/page/'+id, {
      //title: 'title',
      links: x('.item_1 .item', [{
        id: '@id | trim',
        img : '.image img@src',
        href: 'a@href',
        posts: x('a@href', {
          title: 'h1',
          image: '.fix img@src',
          content : '#cap1',
          download: ['.elemento a@href']
          //link : '.elemento a@href'
        })
      }])
    }).stream()
    stream.pipe(res)
})

var port = process.env.PORT || 3000;

// app.listen(3000);
app.listen(port, () => {
  console.log('The party is on at port ' + port);
});
