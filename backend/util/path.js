const path = require('path');

//gives the root pathname
module.exports = path.dirname(require.main.filename); // /Users/username/Desktop/NodeJS/NodeJS-Complete-Guide/Section-6-ExpressJS/backend
console.log(path.dirname(require.main.filename));   