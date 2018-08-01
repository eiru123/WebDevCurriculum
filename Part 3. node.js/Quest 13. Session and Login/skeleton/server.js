const express = require('express'),
	path = require('path'),
	bodyparser = require('body-parser'),
	fs = require('fs'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	app = express();

const users = new Map([
	['knowre', '1234'],
	['user', '4567'],
	['admin', 'dltmd']
]);

const usersData = new Map();
app.use(express.static('client'));
app.use(bodyparser.json());
app.use(cookieParser());
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
	res.cookie('string', 'cookie');
	res.cookie('ddd', 'dddd');
	res.sendFile(path.join(__dirname, 'index.html'));
});

/* TODO: 여기에 처리해야 할 요청의 주소별로 동작을 채워넣어 보세요..! */
app.get('/exist', (req, res) =>{
	const fileNames = fs.readdirSync(__dirname + '/data');
	
	const fileNameJson = {fileNames: fileNames};
	res.cookie('string', 'cookie');
	res.cookie('ddd', 'dddd');
	console.log(req.cookies);
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
	const username = req.body.username;
	const password = req.body.password;
	const sess = req.session;
	let success = false;
	if(findUser(username, password)){
		// 세션생성
		sess.name = username;
		success = true;
	}
	if(usersData.has(username)){
		console.log('user');
		const user = usersData.get(username);
		user.success = success;
		user.has = true;
		res.send(JSON.stringify(user));
	}
	console.dir(sess);
	res.end(JSON.stringify({
		success: success,
		has: false
	}));
});

app.post('/logout', (req, res) => {
	// 세션파기
	const userData = req.body;
	const sess = req.session;
	console.log('logout');
	console.dir(sess);
	usersData.set(userData.username, userData);
	let success = false;
	sess.destroy(function(err){
		if(err) { throw err;}
		console.log('logout success');
		success = true;
		res.end(JSON.stringify({success: success}));
	});
	console.log(usersData);
	res.end(JSON.stringify({success: success}));
	
});

function findUser(name, password){
	if(users.has(name) && users.get(name) === password) return true;
	else return false;
}

const server = app.listen(8080, () => {
	console.log('Server started!');
});
