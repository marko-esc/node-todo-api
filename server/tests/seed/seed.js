const {ObjectID} =  require('mongodb');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: "marko@example.com",
    password: "mypassword",
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
},
{
    _id: userTwoId,
    email: "marko2@example.com",
    password: "my2password",

}]

const todos = [
    {
        _id: new ObjectID(),
        text: 'New text'
    },
    {
        _id: new ObjectID(),
        text: 'Auto insert text',
        completed: true,
        completedAt: 1234
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    })
    .then(()=> {
        return done();
    });
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo])
    })
    .then(()=> {
        return done();
    });

};

module.exports = {todos, populateTodos, users, populateUsers};