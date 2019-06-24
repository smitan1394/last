const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
// Run the app by serving the static files
// in the dist directory
app.use(bodyParser.json(express.static(__dirname + '/db.json')));

app.use(express.static(__dirname + '/dist/conFusion'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + `/dist/conFusion/index.html`)); // load the single view file (angular will handle the page changes on the front-end)
});
// Heroku port
app.listen(process.env.PORT || 8080);
