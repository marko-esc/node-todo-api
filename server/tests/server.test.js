const expect = require('expect');
const request = require('supertest');
const {ObjectID} =  require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe ('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end( (err, res) => {
                if (err) {
                   return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });
    it('should not create a todo if there is invalid data', (done) => {
        request(app)
            .post('/todos')
            .send()
            .expect(400)
            .end ((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => {
                    done(e);
                })
            })
    })
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
});

describe('GET /todos/:id', () => {
    it('should return a todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/hello')
            .expect(404)
            .end(done);
    });

});

describe ('DELETE /todos:id', () => {
    it('should delete a todo', (done) => {
        var hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((err) => {
                    done(err);
                });
    
            })
    });
    it('should  return 404 if todo is ot found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });
    it('should  return 404 if todo id is invalid', (done) => {
        request(app)
            .delete('/todos/hello')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'Changed the description';
        var completed = true;
        request(app)
            .patch(`/todos/${hexId}`)
            .send({text, completed})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var text = 'Changed the description';
        var completed = false;
        request(app)
            .patch(`/todos/${hexId}`)
            .send({text, completed})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(completed);
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end(done);

    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return 401 if user is not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = 'trouble';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((err)=>done(err));
            });

    });
    if('should return validation error if request is invalid', (done) => {
        var email = 'example.example.com';
        var password = 'tble';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)

            .end(done);

    });
    it('should not create a  user if email is in use', (done) => {
        var email = 'marko@example.com';
        var password = 'fabulous';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)

            .end(done);

    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done)=>{
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res)=> {
                expect(res.header['x-auth']).toBeTruthy();
            })
            .end((err, res)=> {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user)=> {
                    expect(user.tokens[0]).toMatchObject({
                        access: 'auth',
                        token: res.header['x-auth']
                    });
                    done();
                }).catch((err)=>done(err));
            });
    });
    it('should reject invalid login', (done)=> {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + '_hello'
            })
            .expect(400)
            .expect((res)=> {
                expect(res.header['x-auth']).toBeFalsy();
            })
            .end((err, res)=> {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user)=> {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err)=>done(err));
            });
    });

    
});

describe('DELETE /users/me/token', ()=> {
    it('should remove token on log out', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[0]._id).then((user)=> {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => {
                    done(err);
                })
            });
    })
});
