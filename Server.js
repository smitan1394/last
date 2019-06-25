const express = require('express');
const path = require('path');
const app = express();
var jsonServer = require('json-server');

app.use('/api', jsonServer.defaults(), jsonServer.router('db.json'));
app.use(express.static(__dirname + '/dist/conFusion'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + `/dist/conFusion/index.html`)); // load the single view file (angular will handle the page changes on the front-end)
});
// Heroku port
app.listen(process.env.PORT || 3000);

