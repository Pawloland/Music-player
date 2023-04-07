const fs = require("fs")
const http = require("http")
const colors = require("colors")
const path = require('path')
const mime = require('mime');
const formidable = require('formidable')
const crypto = require("crypto")
const db = require('./database_methods.js')

// db.a()
// db.b()


var server = http.createServer(function (req, res) {
    // parametr res oznacza obiekt odpowiedzi serwera (response)
    // parametr req oznacza obiekt żądania klienta (request)

    console.log("--------------------------------------")
    console.log(req.method)
    // cors
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', 'OPTIONS, POST, GET');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    try {
        switch (req.method) {
            case "GET":
                console.log("G E T")
                console.log(req.url)
                switch (req.url) {
                    case '/admin': {
                        let file_path = __dirname + '/static/html/admin.html'
                        console.log(file_path)
                        let file = fs.readFileSync(file_path)
                        let mimetype = `${mime.getType(file_path)};charset=utf-8`
                        console.log(mimetype)
                        res.writeHead(200, {
                            'Content-Type': mimetype,
                        })
                        res.end(file);
                        break
                    }

                    case '/html/frontend':
                    case '/html/frontend/':
                    case '/html/frontend/index.html': {
                        res.writeHead(301, {
                            'Location': '/'
                        });
                        res.end();
                        break
                    }
                    case '/': {
                        let file_path = __dirname + '/static/html/frontend/index.html'
                        console.log(file_path)
                        let file = fs.readFileSync(file_path)
                        let mimetype = `${mime.getType(file_path)};charset=utf-8`
                        console.log(mimetype)
                        res.writeHead(200, {
                            'Content-Type': mimetype,
                        })
                        res.end(file);
                        break
                    }

                    case '/html/frontend/favicon.ico': {
                        res.writeHead(301, {
                            'Location': '/favicon.ico'
                        });
                        res.end();
                        break
                    }
                    case '/favicon.ico': {
                        let file_path = __dirname + '/static/html/frontend/favicon.ico'
                        console.log(file_path)
                        let file = fs.readFileSync(file_path)
                        let mimetype = `${mime.getType(file_path)};charset=utf-8`
                        console.log(mimetype)
                        res.writeHead(200, {
                            'Content-Type': mimetype,
                        })
                        res.end(file);
                        break
                    }

                    case req.url.match(/^\/html\/frontend\/assets\/.+/)?.input: {
                        res.writeHead(301, {
                            'Location': req.url.split('/html/frontend')[1]
                        });
                        res.end();
                        break
                    }
                    case req.url.match(/^\/assets\/.+/)?.input: {
                        let file_path = __dirname + '/static/html/frontend/assets' + decodeURI(req.url.split('/assets')[1])
                        console.log(file_path)
                        let file = fs.readFileSync(file_path)
                        let mimetype = `${mime.getType(file_path)};charset=utf-8`
                        console.log(mimetype)
                        res.writeHead(200, {
                            'Content-Type': mimetype,
                        })
                        res.end(file);
                        break
                    }

                    default: {
                        let file_path = __dirname + '/static' + decodeURI(req.url)
                        console.log(file_path)
                        let file = fs.readFileSync(file_path)
                        let stats = fs.statSync(file_path)

                        let mimetype = `${mime.getType(file_path)};charset=utf-8`
                        console.log(mimetype)
                        res.writeHead(200, {
                            'Content-Type': mimetype,
                            "Content-Length": stats.size,
                            "Accept-Ranges": "bytes"
                        });


                        res.end(file, 'binary');
                        break
                    }
                }
                break
            case "POST":
                console.log("P O S T")
                switch (req.url) { // na podstawie req.url używa albo nie używa req.on data i req.on end
                    case '/uploadNewAlbum': {
                        console.log(req.url)
                        let breaker = false
                        let i = 0
                        do {
                            console.log(i)
                            i++
                            let nameDir = crypto.randomBytes(4).toString("hex") //base64
                            let dir = 'static/mp3/' + nameDir;

                            if (!fs.existsSync(dir)) {
                                breaker = true
                                fs.mkdirSync(dir);
                                fs.mkdirSync(dir + '/cover');
                                let acceptable_img_filetypes = ['.bmp', '.gif', '.jpg', '.jpeg', '.png', '.tiff', '.svg']
                                let acceptable_filetypes = ['.bmp', '.gif', '.jpg', '.jpeg', '.png', '.tiff', '.svg', '.mp3']
                                let form = formidable({})
                                console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
                                console.log(form)
                                console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
                                form.uploadDir = dir
                                form.multiples = true
                                form.keepExtensions = true

                                form.parse(req, function (err, fields, files) {
                                    if (files.file != undefined) {
                                        console.log('nie ma undefined')
                                        let cover_done = false
                                        console.log(files.file)
                                        console.log(typeof files.file)
                                        console.log(Array.isArray(files.file))
                                        let files_arr
                                        if (Array.isArray(files.file) == false) {
                                            files_arr = [files.file]
                                        } else {
                                            files_arr = files.file
                                        }
                                        files_arr.forEach(file => {
                                            // let extitnion = (['bmp', 'gif', 'jpg', 'jpeg', 'mp3', 'png', 'tiff'].some(available_extitnion => (function lambda() { (console.log(`&${file.name.split('.')[file.name.split('.').length - 1].toLowerCase()}& &${available_extitnion}&`)); return true }() && (file.name.split('.')[file.name.split('.').length - 1].toLowerCase() == available_extitnion)))) ? file.name.split('.')[file.name.split('.').length - 1].toLowerCase() : 'unknown'
                                            if (acceptable_img_filetypes.some(filetype => filetype == path.extname(file.name)) && cover_done == false) {
                                                cover_done = true
                                                fs.renameSync(file.path, form.uploadDir + "/cover/cover" + path.extname(file.name), function (err) {
                                                    console.log("zmiana nazwy okładki")

                                                })
                                            } else if ((acceptable_img_filetypes.some(filetype => filetype == path.extname(file.name)) && cover_done == true) || (acceptable_filetypes.every(filetype => filetype != path.extname(file.name)))) {
                                                fs.unlinkSync(file.path)
                                                console.log("usuwanie niepotrzebnych danych")

                                            } else if ('.mp3' == path.extname(file.name)) {
                                                fs.renameSync(file.path, form.uploadDir + "/" + file.name, function (err) {
                                                    console.log("zmiana nazwy piosenki")
                                                })
                                            }
                                            // console.log(file.name)
                                            // console.log(path.extname(file.name))
                                            // console.log(file.path)
                                            // console.log(form.uploadDir)
                                            // path.extname(file.name)
                                        })
                                        let mimetype = 'application/json;charset=utf-8'
                                        res.writeHead(200, { 'Content-Type': mimetype })
                                        res.end(JSON.stringify({ ok: 'ok' }))
                                    } else {
                                        console.log('jest undefined')
                                        // setTimeout(() => {
                                        console.log('usuwa pusty album')
                                        fs.rmdirSync(dir, { recursive: true });
                                        console.log('usunął pusty album')
                                        let mimetype = 'application/json;charset=utf-8'
                                        res.writeHead(400, { 'Content-Type': mimetype })
                                        res.end(JSON.stringify({ error: 'Got undefined, please send files.' }))
                                    }
                                })
                            }
                        } while (breaker == false)
                        break
                    }
                    default: {
                        let allData = ''
                        req.on("data", function (data) {
                            allData += data;
                        })

                        req.on("end", async function (data) {
                            console.log('end')
                            try {
                                allData = JSON.parse(allData)
                            } catch (e) {
                                console.log('nie udało się odczytać all data')
                            }
                            console.log(req.url)

                            switch (req.url) {
                                case "/getAllFolders":
                                    fs.readdir(__dirname + '/static/mp3/', function (err, files) {
                                        // console.log(__dirname)

                                        console.log("files: ")
                                        console.log(files)

                                        let mimetype = `application/json;charset=utf-8`
                                        res.writeHead(200, { 'Content-type': mimetype }); // ustawiamy header odpowiedzi
                                        res.end(JSON.stringify(files)); // i wysyłamy dane
                                    });
                                    break
                                case "/getCover":
                                    console.log(allData.title)
                                    fs.readdir(__dirname + '/static/mp3/' + allData.title + "/cover", function (err, files) {
                                        // console.log(__dirname)

                                        console.log("cover: ")
                                        console.log(files)

                                        if (files.length == 0) {
                                            console.log(parseInt(allData.index) % 2)
                                            if (parseInt(allData.index) % 2 == 0) {
                                                img_path = __dirname + '/static/img/generic_album_even.png'
                                            } else {
                                                img_path = __dirname + '/static/img/generic_album_odd.png'
                                            }
                                        } else {
                                            img_path = __dirname + '/static/mp3/' + allData.title + "/cover/" + files[0]
                                        }

                                        let img = fs.readFileSync(img_path)

                                        let mimetype = `${mime.getType(img_path)};charset=utf-8`
                                        console.log(mimetype)
                                        res.writeHead(200, { 'Content-Type': mimetype });
                                        res.end(img, 'binary');
                                    })
                                    break
                                case "/getAllFiles":
                                    console.log(allData.title)
                                    let files_path = `${__dirname}/static/mp3/${allData.title}`
                                    fs.readdir(files_path, function (err, files) {
                                        // console.log(__dirname)

                                        let resArray = []

                                        files.forEach(function (file) {
                                            let stats = fs.statSync(`${files_path}/${file}`)
                                            if (stats.isFile()) {
                                                resArray.push({
                                                    album: allData.title,
                                                    file: file,
                                                    size: stats.size,
                                                })
                                            }
                                        })

                                        // tu można od razu wywołać taką samą funkcję,
                                        // która przeczyta pliki z pierwszego katalogu w tablicy
                                        let mimetype = 'application/json;charset=utf-8'
                                        res.writeHead(200, { 'Content-Type': mimetype });
                                        res.end(JSON.stringify(resArray)); // i wysyłamy dane
                                    })
                                    break
                                case '/getPlaylist': {
                                    console.log(allData)
                                    let playlist = await db.getPlaylist()
                                    // tu można od razu wywołać taką samą funkcję,
                                    // która przeczyta pliki z pierwszego katalogu w tablicy

                                    for (let song of playlist) {
                                        let files_path = `${__dirname}/static/mp3/${song.album}/${song.title}`
                                        song.size = fs.statSync(files_path).size
                                        song.file = song.title
                                        song.title = undefined
                                    }

                                    console.log(playlist)

                                    let mimetype = 'application/json;charset=utf-8'
                                    res.writeHead(200, { 'Content-Type': mimetype });
                                    res.end(JSON.stringify(playlist)); // i wysyłamy dane

                                    break
                                }
                                case '/addToPlaylist': {
                                    console.log(allData)
                                    let id = await db.addToPlaylist(allData.album, allData.title)
                                    // tu można od razu wywołać taką samą funkcję,
                                    // która przeczyta pliki z pierwszego katalogu w tablicy
                                    let mimetype = 'application/json;charset=utf-8'
                                    res.writeHead(200, { 'Content-Type': mimetype });

                                    if (id == false) {
                                        res.end(JSON.stringify({ error: 'Already is in playlist. Didn\'t add anything.' }));
                                    } else {
                                        res.end(JSON.stringify({ message: 'Added to playlist.', id: id })); // i wysyłamy dane
                                    }

                                    break
                                }
                                case '/removeFromPlaylist': {
                                    console.log(allData)
                                    console.log(await db.removeFromPlaylist(allData.id))
                                    // tu można od razu wywołać taką samą funkcję,
                                    // która przeczyta pliki z pierwszego katalogu w tablicy
                                    let mimetype = 'application/json;charset=utf-8'
                                    res.writeHead(200, { 'Content-Type': mimetype });
                                    res.end(JSON.stringify({})); // i wysyłamy dane

                                    break
                                }
                            }
                        })
                        break
                    }
                }
                break
            case "OPTIONS": // to jest potrzebne do corsa, bo bez tego nie działa tzw. preflight, czyli sprawdzenie czy serwer obsługuje dane headery cors
                console.log("O P T I O N S")
                res.writeHead(204);
                res.end();
                break
        }
    } catch (e) {
        console.log('⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠')
        console.log(e)
        res.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' })
        res.end('internal server error')
    }
})

const PORT = process.env.PORT || 3000
server.listen(PORT, function () {
    console.log(`Serwer startuje na porcie ${PORT}`)
    console.log(`http://localhost:${PORT}`.blue)
});