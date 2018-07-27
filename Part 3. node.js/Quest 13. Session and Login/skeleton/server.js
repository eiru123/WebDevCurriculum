const express = require('express'),
	path = require('path'),
	bodyparser = require('body-parser'),
	fs = require('fs'),
	session = require('express-session'),
	app = express();

const users = new Map([
	['knowre', '1234'],
	['user', '4567'],
	['admin', 'dltmd']
]);

app.use(express.static('client'));
app.use(bodyparser.json());
app.use(session({
	secret: 'dfasdfanka',
	resave: false,
	saveUninitialized: true
}));
app.use((req, res, next)=>{
	//처음 앱 생성시 data 폴더가 없을 경우 생성해준다.
	fs.readdir(__dirname + '/data', (err)=>{
		if(err) {
			console.log('none');
			fs.mkdir(__dirname + '/data',(err)=>{
				if(err) console.error(err);
			});
		}
	});
	next();
});
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

/* TODO: 여기에 처리해야 할 요청의 주소별로 동작을 채워넣어 보세요..! */
app.get('/exist', (req, res) =>{
	console.log('wht');
	const fileNames = fs.readdirSync(__dirname + '/data');
	
	const fileNameJson = {fileNames: fileNames};
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(fileNameJson));
});

app.get('/file', (req, res) => {
	console.log(req.headers);
	fs.readFile(__dirname + '/data/' + req.query.name, 'utf8', (err, data) => {
		const jsonData = {data: data};

		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(jsonData));
	});
});

app.post('/file', (req, res) => {
	let fileName = req.body.name;
	let fullFileName = __dirname + '/data/' + fileName;
	fs.stat(fullFileName, (err, stat) => {
		if(err) return;
		else{
			res.send();
			return;
		}
	});
	
	fs.writeFile(__dirname + '/data/' + req.body.name, '', 'utf8', (err) => {
		if(err) {
			console.log(err);
			return console.log('error!');
		}
	});
});

app.put('/file', (req, res) => {
	fs.writeFile(__dirname + '/data/' + req.body.name, req.body.data, 'utf8', (err) => {
		if(err) {
			console.log(err);
			return console.log('error!');
		}
	});
});

app.delete('/file/:fileName', (req, res) => {
	fs.unlink(__dirname + '/data/' + req.params.fileName, (err)=>{
		if(err) return console.error(err);
	});
});

app.post('/login', (req, res) => {
	console.log('login');
	const username = req.body.username;
	const password = req.body.password;
	const sess = req.session;
	let success = false;
	console.dir(sess);
	if(findUser(username, password)){
		// 세션생성
		sess.name = username;
		sess.password = password;
		console.dir(sess);
		success = true;
	}
	console.dir(sess);
	res.end(JSON.stringify({success: success}));
});

app.get('/logout', (req, res) => {
	// 세션파기
	console.dir(req.session);
	delete req.session.username;
	console.dir(req.session);
	res.redirect('/');
});

function findUser(name, password){
	if(users.has(name) && users.get(name) === password) return true;
	else return false;
}

const server = app.listen(8080, () => {
	console.log('Server started!');
});
