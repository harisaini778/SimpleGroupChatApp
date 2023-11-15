// controllers/chatController.js

const { readMessages, appendMessage } = require('../controllers/authController');
const Message = require('../models/Message');

function renderChatPage(req, res) {
    const username = req.cookies && req.cookies.username;
    if (!username) {
        res.redirect('/login');
    } else {
        const messages = readMessages().map((msg) => new Message(msg.username, msg.message));
        res.render('chat', { username, messages });
    }
}

function sendMessage(req, res) {
    const username = req.cookies.username;
    const message = req.body.message;

    if (username && message) {
        appendMessage(message, username); // Fix the order of parameters
    }
    res.redirect('/');
}

module.exports = {
    renderChatPage,
    sendMessage
};
