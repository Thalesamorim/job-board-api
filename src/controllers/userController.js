const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserModel {
    constructor() {
        this.usersFilePath = path.join(__dirname, '../data/users.json');
        this.ensureFileExists();
    }

    ensureFileExists() {
        if (!fs.existsSync(this.usersFilePath)) {
            fs.writeFileSync(this.usersFilePath, JSON.stringify([]));
        }
    }

    getUsers() {
        const data = fs.readFileSync(this.usersFilePath);
        return JSON.parse(data);
    }

    saveUsers(users) {
        fs.writeFileSync(this.usersFilePath, JSON.stringify(users, null, 2));
    }

    findOne(query) {
        const users = this.getUsers();
        return users.find(user => {
            return Object.keys(query).every(key => user[key] === query[key]);
        });
    }

    create(userData) {
        const users = this.getUsers();
        const newUser = {
            ...userData,
            _id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        users.push(newUser);
        this.saveUsers(users);
        return newUser;
    }

    findById(id) {
        const users = this.getUsers();
        return users.find(user => user._id === id);
    }

    updateById(id, updateData) {
        const users = this.getUsers();
        const userIndex = users.findIndex(user => user._id === id);
        
        if (userIndex === -1) return null;

        users[userIndex] = {
            ...users[userIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        this.saveUsers(users);
        return users[userIndex];
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

module.exports = new UserModel();