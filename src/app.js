const http = require('https');
const url = require('url');
const fs = require('fs');
const port = 443;
const hostname = "0.0.0.0";

const httpsOptions = {
    cert: fs.readFileSync('/home/fae/Documents/CA_Cert/certificate.crt'),
    ca: fs.readFileSync('/home/fae/Documents/CA_Cert/ca_bundle.crt'),
    key: fs.readFileSync('/home/fae/Documents/CA_Cert/private.key')

};


const server = https.createServer(function (req, res) {
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

