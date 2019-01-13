const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongdb server.');
    }
    console.log('Connected to mongodb server.');
    const db = client.db('TodoApp');

    // deleteMany
    // db.collection('Todo').deleteMany({text: 'Clean dishes'}).then((results) => {
    //     console.log(results);
    // },
    // (err) => {
    //     console.log('Did not find or delete records: ', err);
    // });

    // deleteMany
    db.collection('Users').deleteMany({name: 'Mark'}).then((results) => {
        console.log(results);
    },
    (err) => {
        console.log('Did not find or delete records: ', err);
    });
    
    // db.collection('Users').findOneAndDelete({
    //     _id: new ObjectID('5c3a040d900d05163c9f80d2')
    // }).then((results) => {
    //     console.log(results);
    // },
    // (err) => {
    //     console.log('Did not find or delete records: ', err);
    // });


    // client.close();
});