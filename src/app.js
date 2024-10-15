var http = require('http');
var url = require('url');
var fs = require('fs');
var port = 80;
var hostname = "0.0.0.0";

var server = http.createServer(function (req, res) {
    console.log(`Received request from ${req.connection.remoteAddress}: ${req.method} ${req.url}`);
    
    var q = url.parse(req.url, true);
    var filename = "/home/fae/my-first-worker2/src/" + q.pathname;
    
    fs.readFile(filename, function(err, data) {
        if (err) {
            console.error(`File not found: ${filename}`);
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        } 
    
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

