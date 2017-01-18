var express = require('express');
var path = require('path');
var fs = require('fs');
var url = require('url');

var apiVersion = require('./package').version;

console.log(apiVersion);


var app = express();

app.set('port', 5000);

app.listen(app.get('port'), function() {
    console.log('Node app is running on http://localhost:' + app.get('port') );
});

app.get('/', function (req, res) {
    res.send('<html><body><h1>My web app http API! Version ' + apiVersion + '</h1></body></html>');
});

app.get

app.post('/post', function (req, res) {
    res.send('<html><body><h1>Post body' + req + '</h1></body></html>');
});


app.all('/test/', function (req, res) {
    res.json('{ test: "Hello test" }');
});


app.all('/api/:apiVersion/*', function (req, res) {
    let fileName = req.method.toLowerCase() + '.json';

    var filePath = req.path + fileName;
    let dirName = '';

    filePath = filePath.replace('/' + apiVersion, '');

    filePath = path.join(__dirname, filePath);

    dirName = path.dirname(filePath);

    fs.readdir(dirName, (error, fileList) => {
        if (error) {
            console.log(error);
            return;
        }

        let result = [];

        fileList.map((subfolder, index) => {
            let readfilePath = path.resolve(dirName, subfolder, fileName);

            fs.stat(readfilePath, (error) => { //TODO rewrite using fs.stat conditions to determinate folders
                if (error) {
                    console.log(error);
                    return;
                }

                fs.readFile(readfilePath, 'utf-8', (error, data) => {
                    result.push(data);

                    if (index === fileList.length - 1) {
                        res.status(200).end(result.toString());
                    }
                });
            });
        });
    });

});
