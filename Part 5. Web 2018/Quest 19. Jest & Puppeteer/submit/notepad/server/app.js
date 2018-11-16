const express = require('express'),
	path = require('path'),
	bodyparser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	userDB = require('./userdb'),
	auth = require('./auth'),
	graphql = require('./graphql');
	app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(cookieParser());
app.all('/*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Requested-With, Authorization');
	next();
});
graphql.applyMiddleware({
	app: app
});

module.exports = app;