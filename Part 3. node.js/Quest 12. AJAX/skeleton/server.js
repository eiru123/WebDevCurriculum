const express = require('express'),
	path = require('path'),
	app = express();

app.use(express.static('client'));

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
	res.redirect('/');
});

const server = app.listen(8080, () => {
	console.log('Server started!');
});
