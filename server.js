import {writeExcel} from "./src/helpers";
const uniqueString = require('unique-string');

var express = require('express');
var app = express();
var http = require('http'),
    fileSystem = require('fs'),
    path = require('path');
var bodyParser = require('body-parser');

app.use("/dist", express.static('dist'));
app.use("/lib", express.static('lib'));
app.use("/out", express.static('out'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


app.get('/', function (req, res) {
    res.sendfile('public/index.html');
});

app.post('/api/xlsx', function (req, response) {
    const filename = uniqueString() + '.xlsx';
    var filePath = path.join(__dirname, "out/" + filename);
    writeExcel(req.body.configurations, filePath);

    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({ url: "out/" + filename }));

});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});