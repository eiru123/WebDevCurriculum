const http = require('http');
const url = require('url');
const querystring = require('querystring');

http.createServer((req, res) => {
	// TODO: 이 곳을 채워넣으세요..!
	let reqUrl = url.parse(req.url);
	if(reqUrl.pathname === "/foo"){
		let query = querystring.parse(reqUrl.query);
		console.log('hello ' + query.bar);
		let tempStr = '';
		req.on('data', chunk=>{
			tempStr += chunk;
		});
		req.on('end', ()=>{
			console.log('hello ' + querystring.parse(tempStr).bar);
		});
	}

	res.writeHead(200);
	res.write("hello world!");
	res.end();
}).listen(8080);
