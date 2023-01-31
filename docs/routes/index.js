const getTodos = require('../todos/get-todos');
const getTodo = require('../todos/get-todo');
const createTodo = require('../todos/create-todo');
const updateTodo = require('../todos/update-todo');
const deleteTodo = require('../todos/delete-todo');
const getUsers = require('../users/get-users');
const getUser = require('../users/get-user');
const createUser = require('../users/create-user');
const updateUser = require('../users/update-user');
const deleteUser = require('../users/delete-user');

module.exports = {
    paths:{
        '/todos':{
            ...getTodos,
            ...createTodo
        },
        '/todos/{id}':{
            ...getTodo,
            ...updateTodo,
            ...deleteTodo
        },
        '/users':{
            ...getUsers,
            ...createUser
        },
        '/users/{id}':{
            ...getUser,
            ...updateUser,
            ...deleteUser
        }
    }
}