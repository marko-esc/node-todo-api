const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data, 'abc123');
console.log(token);
var decoded = jwt.verify(token, 'abc123');
console.log(decoded);


// var text = 'A test string of some characters';
// var hash = SHA256(text).toString();

// console.log(`Text: ${text}`);
// console.log(`SHA256: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256( JSON.stringify(data) + 'somesecret').toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//     console.log('Data is good.');
// }
// else {
//     console.log('Data has been modified.');
// }