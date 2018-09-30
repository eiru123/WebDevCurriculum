const express = require('express');
const app = express();

const server = require('./graphql/schema.js');

server.applyMiddleware({
    app: app
});

const port = process.env.port || 4000;

app.listen(port, () => {
    console.log('server is running port 4000');
});