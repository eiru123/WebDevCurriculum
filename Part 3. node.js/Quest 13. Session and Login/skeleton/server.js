const express = require('express'),
	path = require('path'),
	bodyparser = require('body-parser'),
	fs = require('fs'),
	app = express();

const users = new Map([['knowre', '1234'],
	['user', '4567'],
	['admin', 'dltmd']
]);

app.use(express.static('client'));
app.use(bodyparser.urlencoded({ extended:false}));
app.use(bodyparser.json());

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

/* TODO: 여기에 처리해야 할 요청의 주소별로 동작을 채워넣어 보세요..! */
app.get('/show', (req, res) => {
	fs.readFile(__dirname + '/data/' + req.query.name, 'utf8', (err, data) => {
		const jsonData = {data: data};

		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(jsonData));
	});
});

app.get('/exist', (req, res) =>{
	const fileNames = fs.readdirSync(__dirname + '/data');
	
	const fileNameJson = {fileNames: fileNames};
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(fileNameJson));
});

app.post('/new', (req, res) => {
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
app.post('/login', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	
	if(findUser(username, password)){
		// 세션생성
	}
});

app.get('/logout', (req, res) => {
	// 세션파기
});
function findUser(name, password){
	if(users.has(name) && users.get(name) === password) return true;
	else return false;
}
app.put('/save', (req, res) => {
	fs.writeFile(__dirname + '/data/' + req.body.name, req.body.data, 'utf8', (err) => {
		if(err) {
			console.log(err);
			return console.log('error!');
		}
	});
});

app.delete('/delete/:fileName', (req, res) => {
	fs.unlink(__dirname + '/data/' + req.params.fileName, (err)=>{
		if(err) return console.error(err);
	});
});
const server = app.listen(8080, () => {
	console.log('Server started!');
});
