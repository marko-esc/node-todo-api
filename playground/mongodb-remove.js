const {ObjectID} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');


// Todo.deleteMany({}).then((result) => {
//     console.log(result);
// });

Todo.findByIdAndRemove('5c55d1ce0ff6b4e7ddba645f').then((todo) => {
    console.log(todo);
});