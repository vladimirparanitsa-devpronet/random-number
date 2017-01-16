const http = require('http');
const random = require('./index');

const serverPort = process.argv[2] || 3000;

http
  .createServer((req, res) => {
    random()
      .then((number) => {
        return res.end('Your number is -> ' + number);
      });
  })
  .listen(serverPort);

console.log('http://127.0.0.1:' + serverPort);
