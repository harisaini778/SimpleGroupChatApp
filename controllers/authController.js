// controllers/authController.js

const fs = require('fs');
const Message = require('../models/Message');

function readMessages() {
    try {
        const data = fs.readFileSync('messages.txt', 'utf-8');
        const messages = data.split('\n').filter((msg) => msg.trim() !== '');

        return messages.map((msg) => {
            const [username, content] = msg.split(':');
            return new Message(username, content);
        });
    } catch (error) {
        console.log('Error reading message: ', error);
        return [];
    }
}

function appendMessage(message, username) {
    const newMessage = new Message(username, message);
    fs.appendFileSync('messages.txt', `${newMessage.username}:${newMessage.message}\n`);
}

module.exports = {
    readMessages,
    appendMessage
};
