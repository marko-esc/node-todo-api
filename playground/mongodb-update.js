const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongdb server.');
    }
    console.log('Connected to mongodb server.');
    const db = client.db('TodoApp');

    // db.collection('Todo').findOneAndUpdate({
    //     _id: new ObjectID('5c3b4d0e505a2d5623bada29')
    // }, 
    // {
    //     $set: {
    //         completed: false
    //     }
    // },
    // {
    //     returnOriginal: false
    // }).then((result)=> {
    //     console.log(result);
    // })

    db.collection('Users').findOneAndUpdate(
        {
            _id: new ObjectID('5c3a2818f9dd181030a6351f')
        },
        {
            $inc : {
                age: 10
            }
        },
        {
            returnOriginal: false
        }
    ).then( (result) => {
        console.log(result);
    })




    // client.close();
});