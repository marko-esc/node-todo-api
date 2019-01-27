const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5c435a4dc3c7d22f60613ec3';


// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos: ', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo: ', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log(`Cannot find id: ${id}`);
//     }
//     console.log('Todo By Id: ', todo);
// }).catch((e) => {
//     console.log(e);
// });

User.findById(id).then((user) => {
    if (!user) {
        return console.log(`Invalid user id: ${id}`)
    }
    console.log(user);
}, (e) => {
    console.log(e);
});
