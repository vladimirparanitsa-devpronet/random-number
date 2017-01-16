const fetch = require('node-fetch');

const min = process.argv[3] || 1;
const max = process.argv[4] || 100;

module.exports = function getRandomNumber() {
  return fetch(`https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`)
    .then((response) => {
      return response.text();
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
};
