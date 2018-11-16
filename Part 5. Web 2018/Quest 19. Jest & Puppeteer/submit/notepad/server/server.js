// const express = require('express'),
// 	path = require('path'),
// 	bodyparser = require('body-parser'),
// 	cookieParser = require('cookie-parser'),
// 	session = require('express-session'),
// 	userDB = require('./userdb'),
// 	auth = require('./auth'),
// 	graphql = require('./graphql');
// 	app = express();

// app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({extended: false}));
// app.use(cookieParser());
// app.all('/*', (req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE, OPTIONS');
// 	res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Requested-With, Authorization');
// 	next();
// });
// graphql.applyMiddleware({
// 	app: app
// });
const app = require('./app.js');
console.info(app);
/* TODO: 여기에 처리해야 할 요청의 주소별로 동작을 채워넣어 보세요..! */
// app.post('/login', (req, res, next) => {
// 	const username = req.body.username;
// 	const password = req.body.password;
// 	let redirectPath = null;
// 	userDB.userCheck(username, password)
// 	.then(result => {
// 		let data;
// 		if(result){
// 			const accessToken = auth.signToken(username);
// 			redirectPath = '/';
// 			data = {
// 				accessToken,
// 				redirectPath
// 			};
// 		} else {
// 			redirectPath = '/login';
// 			data = {redirectPath};
// 		}
// 		res.json(data);
// 	});
// });

// app.get('/exist', auth.ensureAuth(), (req, res) =>{
// 	let data = null;
// 	let fileNames = [];
	
// 	const getData = async () => {
// 		try{
// 			const files = await userDB.getFiles(req.user);
// 			const userData = await userDB.getUsers(req.user);

// 			data = userData[0].dataValues;
// 			data['openTabs'] = [];
// 			files.forEach(result => {
// 				let fileData = result.dataValues;
// 				fileNames.push(fileData.filename);
// 				if(fileData.open === 1)
// 					data['openTabs'].push(fileData.filename);
// 			});
// 			return true;
// 		}catch(err){
// 			console.error(err);
// 			return false;
// 		}
// 	}
// 	getData()
// 	.then(result => {
// 		if(result){
// 			const jsonData = {
// 				fileNames: fileNames,
// 				userData: data
// 			}
// 			res.json(JSON.stringify(jsonData));
// 		}
// 	}).catch(err=>{
// 		console.error(err);
// 	});
// });

// // app.all('/file', auth.ensureAuth());
// app.get('/file', auth.ensureAuth(), async (req, res) => {
// 	const data = await userDB.getContent(req.user, req.query.filename);
// 	console.log(data);
// 	res.json(data);
// });

// app.post('/file', auth.ensureAuth(), (req, res) => {
// 	let fileName = req.body.name;
// 	userDB.createFiles(req.user, fileName)
// 	.then(res => {
// 		res.end();
// 	}).catch(err => {
// 		console.error(err);
// 	});
// });

// app.put('/file', auth.ensureAuth(), async (req, res) => {
// 	await userDB.updateFile(req.user, req.body.name, req.body.content);
// 	res.end();
// });

// app.delete('/file', auth.ensureAuth(), async (req, res) => {
// 	await userDB.deleteFile(req.user, req.query.filename);
// 	res.end();
// });
// app.post('/logout', auth.ensureAuth(), 	(req, res) => {
// 	const userData = req.body.userData;
// 	const logout = async () => {
// 		await userDB.logoutUpdate(req.user, userData);
// 	};
	
// 	logout();
// 	res.end();
// });
const server = app.listen(3000, () => {
	console.log('Server started!');
});
