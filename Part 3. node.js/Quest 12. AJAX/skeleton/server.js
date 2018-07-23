const express = require('express'),
	path = require('path'),
	bodyparser = require('body-parser'),
	fs = require('fs'),
	app = express();

app.use(express.static('client'));
app.use(bodyparser.json({ extended:false}));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

/* TODO: 여기에 처리해야 할 요청의 주소별로 동작을 채워넣어 보세요..! */
app.get('/show', (req, res) => {
	
	res.redirect('/');
});

app.get('/move', (req, res) => {
	res.redirect('/');
});

app.post('/save', (req, res) => {
	res.redirect('/');
});

app.post('/new', (req, res) => {
	let fileName = req.body.name;
	let fullFileName = __dirname + '/data/' + fileName;
	fs.stat(fullFileName, (err, stat) => {
		if(err) return;
		else{
			res.redirect('/');
			console.log(res);
			res.send();
			return;
		}
	});
	res.json({name: 'dddd'});
	console.log(res);
	console.log(res.body);
	fs.writeFile(__dirname + '/data/' + req.body.name, '', 'utf8', (err) => {
		// if(err) {
		// 	console.log(err);
		// 	return console.log('error!');
		// }
	});
	res.redirect('/');
});

const server = app.listen(8080, () => {
	console.log('Server started!');
});

// 나중에 이름 변경 관련 기능을 위해 사용!
// console.log(fs.stat(__dirname + '/data/' + req.body.name, (err, stat) => {
// 	console.log(err);
// 	console.log(stat);
// }));