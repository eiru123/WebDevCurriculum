const http = require('http');

const server = http.createServer(function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log(`${req.method} ${req.url}`);
    res.end('Hello world!');
});

const port = 8080;
server.listen(port, function(){
    console.log(`Ajax server started on port ${port}`);
});