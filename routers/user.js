const express = require('express');
const UserController = require('../controllers/user');
const api = express.Router();

api.post('/create-user', UserController.createUser);
api.get('/get-user/:id', UserController.getUserById);
api.put('/update-user/:id', UserController.updateUser);
api.delete('/delete-user/:id', UserController.deleteUser);

module.exports = api;
