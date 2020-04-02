var Xray = require('x-ray');
var router = require('express').Router();

const baseUrl = 'https://channelmyanmar.org/movies/';
const pageUrl = 'https://channelmyanmar.org/movies/page/';
const thisUrl = 'http://localhost:3000/api/'
const x = Xray({
    filters: {
    regex: function(value) {
        return typeof value === 'string' ? value.replace(/(\(.*?\))/g, '') : value
      },
    replace: function(value) {
        return typeof value === 'string' ? value.replace('https://channelmyanmar.org/page/', ' ') : value
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
      mega: function(value) {
        if (typeof value === 'string') {
           if (value.includes("https://mega.nz/")){
             var url = value.replace("https://mega.nz/", "https://mega.nz/embed");
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
  });
// router.get('/', function(req, res, next) {
//     res.send('index')
// });

router.get('/api/', function(req, res, next) {
    x(baseUrl, {
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
            })
        }])
      })
    })(function(err, obj) {
        console.log(err, obj);
        res.send(obj);
        // res.render('views/products', {
        //     products: obj.data,
        //     current: obj.thispage,
        //     pages: obj.totalCount
        // });
    })
});
router.get('/api/:page', function(req, res, next) {
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
                })
            }])
        })
        (function(err, obj) {
            console.log(err, obj);
            res.send(obj);
            // res.render('main/api', {
            //     products: obj.data,
            //     current: obj.thispage,
            //     pages: obj.totalCount
            // });
        })
});

router.get('/movie', function(req, res, next) {
    let urls = req.query.url;

    x(urls, {
            title: 'h1 | number',
            category: 'i.limpiar',
            uploadDate: 'meta[itemprop="uploadDate"]@content',
            embedUrl: 'meta[itemprop="embedUrl"]@content',
            director: '#single div[itemprop="director"] meta@content',
            actors: x('div[itemprop="actors"]', ['meta[itemprop="name"]@content']),
            gallary: x('div.galeria_img', ['img@src']),
            download: x('li.elemento', [{ size: '.c', site: '.b | host', quality: '.e', url: 'a@href' }]),
            mega: x('li.elemento', [{  url: 'a@href | mega' }]),
        })
        (function(err, obj) {
            res.send(obj);
        });

});
module.exports = router;



    // Product
    //     .find({})
    //     .skip((perPage * page) - perPage)
    //     .limit(perPage)
    //     .exec(function(err, products) {
    //         Product.count().exec(function(err, count) {
    //             if (err) return next(err)
    //             res.render('main/products', {
    //                 products: products,
    //                 current: page,
    //                 pages: Math.ceil(count / perPage)
    //             })
    //         })
    //     })
    // var stream = 