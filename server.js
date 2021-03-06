var express = require('express');
var Xray = require('x-ray');
var app = express();
var cors = require('cors');
const mongoose = require("mongoose");
const Movies = require("./models/movies");
var urls = "http://oomovie.net/";
const baseUrl = 'https://channelmyanmar.org/movies/';
const pageUrl = 'https://channelmyanmar.org/movies/page/';
const thisUrl = 'https://xraymovie.herokuapp.com/';


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
    },
    m3u: function (value) {
      return typeof value === 'string' ?  value.match(/var url_ios = '(.*?)';/) : value
    },
    play: function (value) {
      return typeof value === 'string' ?  value.match(/var url_play = '(.*?)';/) : value
    },
    https: function (value) {
      return typeof value === 'string' ? value.replace("http://" , "https://") : value
    },
    regex: function(value) {
        return typeof value === 'string' ? value.replace(/(\(.*?\))/g, '') : value
      },
      num: function(value) {
        return typeof value === 'string' ? Number(value) :  value
      },
     number: function(value) {
        return typeof value === 'string' ? Number(value.replace(/\D+/g,'')) :  value
      },
      fix2: function(value) {
        if (typeof value === 'string') {
          let refine = Number(value) + 1;
          let refine2 = thisUrl+refine;
          return refine2;
        }
      },
      yadi: function(value) {
      if (typeof value === 'string') {
         if (value.includes("https://yadi.sk")){
           // var url = getUrl(value);
            return value;
         }
         return ;
        }
      },
      mega: function(value) {
        if (typeof value === 'string') {
           if (value.includes("https://mega.nz/")){
             var url = value.replace("https://mega.nz/file", "https://mega.nz/embed");
              return url;
           }
           return ;
          }
        },
     host: function(value) {
            if (typeof value === 'string') {
                var url = value.replace("https://", "").trim();
                //url = url.split(".")[0];
                if (url.includes("Soliddrive.co")) {
                    url = "SolidDrive";
                } else if (url.includes("drive.google.com")) {
                    url = "Myandrive";
                } else if (url.includes("disk.yandex.com")) {
                    url = "Yandex" ;
                } else if (url.includes("mirrorace")) {
                    url = "Mirrorace";
                } else if (url.includes("fastload")) {
                    url = "Fastload";
                } else if (url.includes("megaup")) {
                    url = "MegaUp";
                } else if (url.includes("mega")) {
                    url = "MeGa";
                }else if (url.includes("1fichier.com")) {
                    url = "1Fichier";
                }else if (url.includes("upstream.to")) {
                    url = "Upstream";
                };
                return url;
            }
        }
  }
})
app.get('/api/:page', function(req, res, next) {
    var perPage = 9
    var page = pageUrl + req.params.page || baseUrl

    x(page, {
            title: 'title',
            thispage: '.paginado ul li.dd a | num',
            totalCount: '.paginado ul li:last-child a@href | number',
            nextpage: '.paginado ul li.dd a | fix2',
            totalpage: '.paginado ul li:last-child a@href',
            results: x('.peliculas .items .item', [{
                id: '@id | number',
                quality: '.calidad2',
                title: '.image img@alt | regex',
                rate: '.imdbs',
                type: '.typepost',
                year: '.image img@alt | number',//'.fixyear .year',
                link: ' a@href',
                img: '.image img@src',
                details: x('a@href', {
                    title: 'h1  | regex',
                    // description: 'a@href',  
                    category: 'i.limpiar',
                    uploadDate: 'meta[itemprop="uploadDate"]@content',
                    embedUrl: 'meta[itemprop="embedUrl"]@content',
                    director: '#single div[itemprop="director"] meta@content',
                    actors: x('div[itemprop="actors"]', ['meta[itemprop="name"]@content']),
                    gallary: x('div.galeria_img', ['img@src']),
                    download: x('li.elemento', [{ size: '.c', site: '.b | host', quality: '.e', url: 'a@href' }]),
                    mega: x('li.elemento', [{  url: 'a@href | mega' }]),
                    yadi: x('li.elemento', [{title: 'a@href | yadi'}]),
                })
            }])
        })
        (function(err, obj) {
            console.log(err, obj);
            res.send(obj);
        })
});
app.get('/soccer', cors(), function(req, res) {
    var stream =x(urls, {
    matches : x('.match-items .match-item',[{
    time : 'span@data-countdown',
    teams : 'a',
      href : 'a@href',
      info: x('a@href', {
        title : 'title',
        ios : '.entry-content p| m3u | https' ,
        play : '.entry-content p | play | https',
        category : '.cat-links a'
      })
    }])
 }).stream()
  stream.pipe(res)
});

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
app.get('/:id', cors(), function (req, res) {
  var id = req.params.id
  var stream = x('https://channelmyanmar.org/' + id, {
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

app.get('/movie',cors(), function (req, res) {
  var stream = x('https://channelmyanmar.org/movies', {
    links: x('.item .boxinfo', [{
      text: 'a',
      href: 'a@href',
      id: href.length,
      posts: x('a@href', {

        title: 'h1',
        image: '.fix img@src',
        download: ['.elemento a@href']
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
        console.log('No Fount :( !! But We start Scrape Now Sir')
        var stream = x('https://channelmyanmar.org/?p=' + id, {
          ids: 'link[rel="shortlink"]@href | repid',
          title: 'title',
          text: '#cap1',
          rate: '.imdb_r .a span',
          director: '.meta_dd a',
          actor: '.meta_dd.limpiar',
          image: '.fix img@src',
          categories: 'p.meta i.limpiar a',
          posts: x('.elemento', [{
            site: '.b | trim',
            download: 'a@href',
            quality: '.d',
            size: ' .c'
          }])
        })(function (err, obj) {
        Movies.findOrCreate(obj,{ appendToArray: true }, (err, result) => {
          console.log('WE ADDED  DATABAS');
          res.send(result);
        })
        })
    }
  })
})

var port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('The party is on at port ' + port);
});
