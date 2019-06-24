const express = require('express');
const path = require('path');
const app = express();
// Run the app by serving the static files
// in the dist directory
const fs = require('fs')
let jsonData = {}
fs.readFile('./db.json', 'utf-8', (err, data) => {
  if (err) throw err
  
  jsonData = JSON.parse(data)
})
app.use(express.static(jsonData));

app.use(express.static(__dirname + '/dist/conFusion'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + `/dist/conFusion/index.html`)); // load the single view file (angular will handle the page changes on the front-end)
});
// Heroku port
app.listen(process.env.PORT || 8080);


