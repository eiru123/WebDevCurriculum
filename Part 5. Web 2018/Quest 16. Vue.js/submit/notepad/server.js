const express = require('express'),
	path = require('path'),
	bodyparser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	userDB = require('./userdb');
	app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(cookieParser());
app.all('/*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Requested-With');
	next();
});
// app.use(session({
// 	secret: 'mysecret',
// 	resave: false,
// 	saveUninitialized: false
// }));

// app.use('/', express.static(__dirname + '/dist'));
// app.use((req, res, next) => {
// 	console.log(req.path);
// 	console.log(req.session);
// 	if((req.session && req.session.username) || req.path === '/login') return next();
// 	else return res.redirect('/login');
// // });

// app.get('/', (req, res) => {
// 	res.sendFile(path.join(__dirname, '/index.html'));
// });
// app.get('/login', (req, res) => {
// 	res.sendFile(path.join(__dirname, '/client/login.html'));
// });
/* TODO: 여기에 처리해야 할 요청의 주소별로 동작을 채워넣어 보세요..! */
app.post('/login', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const sess = req.session;
	let success = false;
	
	userDB.userCheck(username, password)
	.then(result => {
		if(result){
			// 세션생성
			sess.username = username;
			success = true;
			res.redirect('/');
		} else {
			res.redirect('/login');
		}
	});
});
app.get('/exist', (req, res) =>{
	let data = null;
	let fileNames = [];
	
	const getData = async () => {
		try{
			// const files = await userDB.getFiles(req.session.username);
			// const userData = await userDB.getUsers(req.session.username);
			const files = await userDB.getFiles('knowre');
			const userData = await userDB.getUsers('knowre');

			data = userData[0].dataValues;
			data['openTabs'] = [];
			files.forEach(result => {
				let fileData = result.dataValues;
				fileNames.push(fileData.filename);
				if(fileData.open === 1)
					data['openTabs'].push(fileData.filename);
			});
			return true;
		}catch(err){
			console.error(err);
			return false;
		}
	}
	getData()
	.then(result => {
		if(result){
			const jsonData = {
				fileNames: fileNames,
				userData: data
			}
			res.json(JSON.stringify(jsonData));
		}
	}).catch(err=>{
		console.error(err);
	});
});

app.get('/file', (req, res) => {
	userDB.getContent(req.session.username, req.query.name, res);
});

app.post('/file', (req, res) => {
	let fileName = req.body.name;
	console.log(fileName);
	userDB.createFiles('knowre', fileName)
	.then(result => {
		res.end();
	}).catch(err => {
		console.error(err);
	});
});

app.put('/file', (req, res) => {
	userDB.updateFile(req.session.username, req.body.name, req.body.data, res);
});

app.delete('/file/:filename', (req, res) => {
	userDB.deleteFile(req.session.username, req.params.filename, res);
});

app.post('/logout', (req, res) => {
	// 세션파기
	
	const userData = req.body.userData;
	const sess = req.session;
	const logout = async () => {
		await userDB.logoutUpdate(sess.username, userData);
		await sess.destroy(()=>{
			res.redirect('/login');
		});
	};
	
	logout();
});

const server = app.listen(3000, () => {
	console.log('Server started!');
});
