const http = require('http');
const { Http2ServerRequest } = require('http2');
const port = 3000;



http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    res.write('Hello JS World!');
    res.end();

}).listen(port);