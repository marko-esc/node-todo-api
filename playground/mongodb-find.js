const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongdb server.');
    }
    console.log('Connected to mongodb server.');
    const db = client.db('TodoApp');

    // Get the specific data
    // db.collection('Todo').find({
    //     _id: new ObjectID('5c3a0226a7119a2a50c70b72')
    // }).toArray().then((docs) => {
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Could not retrieve data: ', err);
    // });

    // db.collection('Todo').find().count().then((count) => {
    //     console.log(`Todo count: ${count}`);
    // }, (err) => {
    //     console.log('Could not retrieve data: ', err);
    // });

    db.collection('Users').find({name: 'Marko'}).count().then((count) => {
        console.log(`Todo count: ${count}`);
    }, (err) => {
        console.log('Could not retrieve data: ', err);
    });

    client.close();
});