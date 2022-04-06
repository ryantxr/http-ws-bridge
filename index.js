// This is a crude webserver listening on port 4200
const port = 4200;
// Importing http core package/module provided by nodejs
var http = require('http');
var fs = require('fs');
const path = require('path');
// Creating a server
const server = http.createServer(function (req, res) {
    var file = req.url;
    console.log(req.url);
    // If we don't get a specific file request, get index.html
    if ( req.url == '/' ) {
        file = '/index.html';
    }
    let pathfile = __dirname + file;
    if ( !fs.existsSync(pathfile) ) {
        pathfile = '/index.html';
    }
    console.log("file: " + pathfile);
    fs.readFile(pathfile, function (err, data) {
        if ( err ) {
          err.file = pathfile;
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        // Write response as Html(text)
        res.writeHead(200, {'Content-Type': 'text/html'});
        // Writing static text
        res.end(data);
    });
});
server.listen((port), () => {
    console.log("Server is running");
});