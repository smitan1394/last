const express = require('express');
const path = require('path');
const app = express();
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080;

server.use(middlewares);
server.use(router);

server.listen(port);

app.use(express.static(__dirname + '/dist/conFusion'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + `/dist/conFusion/index.html`)); // load the single view file (angular will handle the page changes on the front-end)
});
// Heroku port
app.listen(process.env.PORT || 8080);


