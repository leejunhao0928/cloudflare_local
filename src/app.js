const https = require('https');
const url = require('url');
const fs = require('fs');
const port = 2052;
const hostname = "0.0.0.0";

// HTTPS server options with TLS configurations
const httpsOptions = {
    cert: fs.readFileSync('/home/fae/Documents/CA_Cert/certificate.crt'),
    ca: fs.readFileSync('/home/fae/Documents/CA_Cert/ca_bundle.crt'),
    key: fs.readFileSync('/home/fae/Documents/CA_Cert/private.key'),
    secureOptions: require('constants').SSL_OP_NO_SSLv2 |
                   require('constants').SSL_OP_NO_SSLv3 |
                   require('constants').SSL_OP_NO_TLSv1 |
                   require('constants').SSL_OP_NO_TLSv1_1,
    ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384',
    honorCipherOrder: true
};

const server = https.createServer(httpsOptions, function (req, res) {
    console.log(`Received request from ${req.connection.remoteAddress}: ${req.method} ${req.url}`);
    
    // Parse the request URL
    var q = url.parse(req.url, true);
    
    // Check if the requested path is '/headers' to return HTTP request headers
    if (q.pathname === '/headers') {
        // Return all HTTP request headers as JSON in the response body
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(req.headers, null, 2));
        return res.end();
    }

    // Serve static files for other paths
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
});

// Start the server and listen on the specified port and hostname
server.listen(port, hostname, () => {
  console.log(`Server running at https://${hostname}:${port}/`);
});
