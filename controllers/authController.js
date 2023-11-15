 // controllers/authController.js

const fs = require('fs');


function readMessages() {
    try {
        const data = fs.readFileSync('messages.txt', 'utf-8');
        const messages = data.split('\n').filter((msg) => msg.trim() !== '');
        return messages.map((msg) => JSON.parse(msg));
    } catch (error) {
        console.log('Error reading message: ', error);
        return [];
    }
};


function appendMessage(message, username) {
    const newMessage = { username, message };
    fs.appendFileSync('messages.txt', JSON.stringify(newMessage) + '\n');
};

module.exports = {
    readMessages,
    appendMessage
}