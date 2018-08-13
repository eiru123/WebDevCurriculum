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

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
	secret: 'mysecret',
	resave: false,
	saveUninitialized: false
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
app.use('/client', express.static(__dirname + '/client'));
app.use((req, res, next) => {
	console.log(req.path);
	console.log(req.session);
	if((req.session && req.session.username) || req.path === '/login') return next();
	else return res.redirect('/login');
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/client/index.html'));
});
app.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname, '/client/login.html'));
});
/* TODO: 여기에 처리해야 할 요청의 주소별로 동작을 채워넣어 보세요..! */
app.post('/login', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const sess = req.session;
	let success = false;
	if(findUser(username, password)){
		// 세션생성
		sess.username = username;
		success = true;
		res.redirect('/');
	} else {
		res.redirect('/login');
	}
	
});
app.get('/exist', (req, res) =>{
	const fileNames = fs.readdirSync(__dirname + '/data');
	let data = null;
	if(req.session.username) data = usersData.get(req.session.username);
	const jsonData = {
		fileNames: fileNames,
		userData: data
	}
	res.json(JSON.stringify(jsonData));
});

app.get('/file', (req, res) => {
	console.log('get');
	console.log(req.session);
	fs.readFile(__dirname + '/data/' + req.query.name, 'utf8', (err, data) => {
		const jsonData = {data: data};
		console.log(jsonData);
		res.json(jsonData);
	});
	
});

app.post('/file', (req, res) => {
	console.log('post');
	console.log(req.session);
	let fileName = req.body.name;
	let fullFileName = __dirname + '/data/' + fileName;
	fs.stat(fullFileName, (err, stat) => {
		if(err) return;
		else{
			res.end();
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
	console.log('put');
	console.log(req.session);
	fs.writeFile(__dirname + '/data/' + req.body.name, req.body.data, 'utf8', (err) => {
		if(err) {
			console.log(err);
			return console.log('error!');
		}
	});
});

app.delete('/file/:fileName', (req, res) => {
	console.log('delete');
	fs.unlink(__dirname + '/data/' + req.params.fileName, (err)=>{
		if(err) return console.error(err);
	});
});



app.post('/logout', (req, res) => {
	// 세션파기
	console.log(req.body);
	const userData = req.body.userData;
	const sess = req.session;
	usersData.set(sess.username, userData);
	console.log(sess.username);
	console.log(usersData.get(sess.username));
	sess.destroy((()=>{
		res.redirect('/login');
	}));
});

function findUser(name, password){
	if(users.has(name) && users.get(name) === password) return true;
	else return false;
}

const server = app.listen(8080, () => {
	console.log('Server started!');
});
