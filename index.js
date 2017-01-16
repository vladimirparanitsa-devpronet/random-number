const fetch = require('node-fetch');
const http = require('http');

const serverPort = process.argv[2] || 3000;
const min = process.argv[3] || 1;
const max = process.argv[4] || 100;

http.createServer((req, res) => {
  fetch(`https://www.randoms.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`)
    .then((response) => {
      return response.text();
    })
    .then((number) => {
      res.end('You number is -> ' + number);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}).listen(serverPort);

console.log('http://127.0.0.1:' + serverPort);
