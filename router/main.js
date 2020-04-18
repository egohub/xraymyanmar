var Xray = require('x-ray');
var router = require('express').Router();
const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://channelmyanmar.org/movies/';
const pageUrl = 'https://channelmyanmar.org/movies/page/';
const thisUrl = process.env.thisUrl;
const catUrl = 'https://channelmyanmar.org/category/';

const x = Xray({
    filters: {
        replace: function(value) {
            return typeof value === 'string' ? value.replace('https://channelmyanmar.org/page/', ' ') : value
        },
        category: function(value, i) {
            if (typeof value === 'string') {
                let refine = value.replace('https://channelmyanmar.org/category', '');
                let refine2 = refine + 'page/1';
                return refine;
            }
        },
        number: function(value) {
            return typeof value === 'string' ? Number(value.replace(/\D+/g, '')) : value
        },
        fix2: function(value) {
            if (typeof value === 'string') {
                let refine = Number(value) + 1;
                let refine2 = thisUrl + 'api/' + refine;
                return refine2;
            }
        },
        next: function(value) {
            if (typeof value === 'string') {
                let refine = Number(value) + 1;
                return refine;
            }
        },
        regex: function(value) {
            return typeof value === 'string' ? value.replace(/(\(.*?\))/g, '') : value
        },
        movieid: function(value) {
            return typeof value === 'string' ? value.replace('https://channelmyanmar.org/', '') : value
        },
        yadi: function(value) {
            if (typeof value === 'string') {
                if (value.includes("https://yadi.sk")) {
                    // var url = getUrl(value);
                    return value;
                }
                return;
            }
        },
        yadiId: function(value) {
            return typeof value === 'string' ? value.replace('https://yadi.sk/i/', '') : value
        },
        mega: function(value) {
            if (typeof value === 'string') {
                if (value.includes("https://mega.nz/")) {
                    var url = value.replace("https://mega.nz/file", "https://mega.nz/embed");
                    return url;
                }
                return;
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
                    url = "Yandex";
                } else if (url.includes("mirrorace")) {
                    url = "Mirrorace";
                } else if (url.includes("fastload")) {
                    url = "Fastload";
                } else if (url.includes("megaup")) {
                    url = "MegaUp";
                } else if (url.includes("mega")) {
                    url = "MeGa";
                } else if (url.includes("1fichier.com")) {
                    url = "1Fichier";
                } else if (url.includes("upstream.to")) {
                    url = "Upstream";
                };
                return url;
            }
        }
    }
});

router.get('/api/category', function(req, res) {

    var stream = x('https://channelmyanmar.org', '#moviehome .cat-item', [{
        title: 'a',
        id: 'a@href | category',
        count: 'span |  number',
    }]).stream()
    stream.pipe(res);
});

router.get('/api/category/:name', function(req, res) {
    var name = req.params.name,
        url = catUrl + name;
    console.log(req.hostname + req.originalUrl);
    console.log(req.originalUrl);
    var stream = x(url, {
        title: 'title',
        thispage: '.paginado ul li.dd a | number',
        totalCount: '.paginado ul li:last-child a@href | number',
        nextpage: '.paginado ul li.dd  a | next',
        totalpage: '.paginado ul li:last-child a@href',
        data: x('.peliculas .items .item', [{
            id: '@id | number',
            quality: '.calidad2',
            title: '.image img@alt',
        }])
    }).stream()
    stream.pipe(res);
    // res.send(url)
});

router.get('/category/:name/page/:page', function(req, res) {
    var page = req.params.page;
    var name = req.params.name;
    var xurl = 'https://channelmyanmar.org/category/' + name + '/page/' + page;
    stream = x(xurl, {
            title: 'title',
            thispage: '.paginado ul li.dd a | number',
            totalCount: '.paginado ul li:last-child a@href | number',
            nextpage: '.paginado ul li.dd a | fix2',
            totalpage: '.paginado ul li:last-child a@href',
            results: x('.peliculas .items .item', [{
                id: '@id | number',
                quality: '.calidad2',
                title: '.image img@alt | regex',
                rate: '.imdbs',
                type: '.typepost',
                year: '.image img@alt | number', //'.fixyear .year',
                link: ' a@href | movieid',
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
                    mega: x('li.elemento', [{ url: 'a@href | mega' }]),
                    yadi: x('li.elemento', [{ url: 'a@href | yadi', id: 'a@href | yadi  |yadiId' }]),
                })
            }])
        })
        .stream()
    stream.pipe(res)

});

router.get('/api/', function(req, res, next) {
    x(baseUrl, {
        title: 'title',
        thispage: '.paginado ul li.dd a ',
        totalCount: '.paginado ul li:last-child a@href | number',
        nextpage: '.paginado ul li.dd a | fix2',
        totalpage: '.paginado ul li:last-child a@href',
        data: x('.peliculas .items .item', [{
            id: '@id | number',
            quality: '.calidad2',
            title: '.image img@alt',
            rate: '.imdbs',
            type: '.typepost',
            year: '.fixyear .year',
            link: ' a@href',
            img: '.image img@src',
            details: x('a@href', {
                title: 'h1 | number',
                // description: 'a@href',  
                category: 'i.limpiar',
                uploadDate: 'meta[itemprop="uploadDate"]@content',
                embedUrl: 'meta[itemprop="embedUrl"]@content',
                director: '#single div[itemprop="director"] meta@content',
                actors: x('div[itemprop="actors"]', ['meta[itemprop="name"]@content']),
                gallary: x('div.galeria_img', ['img@src']),
                download: x('li.elemento', [{ size: '.c', site: '.b| host', quality: '.e', url: 'a@href' }]),
            })
        }])
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
            thispage: '.paginado ul li.dd a | number',
            totalCount: '.paginado ul li:last-child a@href | number',
            nextpage: '.paginado ul li.dd a | fix2',
            totalpage: '.paginado ul li:last-child a@href',
            results: x('.peliculas .items .item', [{
                id: '@id | number',
                quality: '.calidad2',
                title: '.image img@alt',
                rate: '.imdbs',
                type: '.typepost',
                year: '.fixyear .year',
                link: ' a@href',
                img: '.image img@src',
                details: x('a@href', {
                    title: 'h1 | regex',
                    // description: 'a@href',  
                    category: 'i.limpiar',
                    uploadDate: 'meta[itemprop="uploadDate"]@content',
                    embedUrl: 'meta[itemprop="embedUrl"]@content',
                    director: '#single div[itemprop="director"] meta@content',
                    actors: x('div[itemprop="actors"]', ['meta[itemprop="name"]@content']),
                    gallary: x('div.galeria_img', ['img@src']),
                    download: x('li.elemento', [{ size: '.c', site: '.b | host', quality: '.e', url: 'a@href' }]),
                    mega: x('li.elemento', [{ url: 'a@href | mega' }]),
                    yadi: x('li.elemento', [{ url: 'a@href | yadi', id: 'a@href | yadi  |yadiId' }]),
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

router.get('/api/movie', function(req, res, next) {
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
        })
        (function(err, obj) {
            res.send(obj);
        });

});

router.get('/api/movie/:id', function(req, res) {
    let cmUrl = 'https://channelmyanmar.org/';
    let id = req.params.id;
    let url = cmUrl + id

    var stream = x(url, {
            title: 'h1  | regex',
            description: '#cap1 p',
            category: 'i.limpiar',
            uploadDate: 'meta[itemprop="uploadDate"]@content',
            embedUrl: 'meta[itemprop="embedUrl"]@content',
            director: '#single div[itemprop="director"] meta@content',
            actors: x('div[itemprop="actors"]', ['meta[itemprop="name"]@content']),
            gallary: x('div.galeria_img', ['img@src']),
            download: x('li.elemento', [{ size: '.c', site: '.b | host', quality: '.e', url: 'a@href' }]),
            mega: x('li.elemento', [{ url: 'a@href | mega' }]),
            yadi: x('li.elemento', [{ title: 'a@href | yadi' }]),
            relate: x('#slider1 div div', [{ link: 'a@href', title: 'img@alt', img: 'img@src' }])
        })
        .stream()
    stream.pipe(res)
});
router.get('/yadi', function(req, res) {
    var url = req.query.url;
    var sample = axios.get(url);
    sample.then(result => {
        var videos = 'https://egohub.github.io/watch/?video=';
        var $ = cheerio.load(result.data);
        var ini = $("script[type='application/json']").text();
        console.log(init);
        var _json = JSON.parse(ini);
        var json = _json.rootResourceId
        let data = _json.resources;
        var m3u = data[json].videoStreams.videos;
        res.send(m3u);
    });
});

router.get('/help', function(req, res) {
    res.set('Content-Type', 'text/html')
    res.send(Buffer.from('<h3>Api Endpoint</h3> ' +
        '<h3 > Category</h3>' +
        '<a href=""> https://xraymyanmar.herokuapp.com/api/category </a> <hr> '
    ))
});
module.exports = router;
