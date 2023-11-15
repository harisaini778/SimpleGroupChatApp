// controllers/chatController.js

const { readMessages, appendMessage } = require('../controllers/authController');

function renderChatPage(req, res) {
    const username = req.cookies && req.cookies.username;
    if (!username) {
        res.redirect('/login');
    } else {
        const messages = readMessages();
        res.render('chat', { username, messages });
    }
};

function sendMessage(req, res) {
    const username = req.cookies.username;
    const message = req.body.message;

    if (username && message) {
        appendMessage(username, message);
    }
    res.redirect('/');
};

module.exports = {
    renderChatPage,
    sendMessage
};