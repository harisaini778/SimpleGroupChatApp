// /app.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/login', (req, res) => {
    // Check if the username is already in local storage
    const username = req.cookies && req.cookies.username;

    // If the username is found, redirect to '/'
    if (username) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

app.post('/login', (req, res) => {
    const { username } = req.body;

    if (username) {
        res.cookie('username', username, { expires: new Date(Date.now() + 3600000), httpOnly: true });
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

app.get('/', (req, res) => {
    const username = req.cookies && req.cookies.username;

    if (!username) {
        res.redirect('/login');
    } else {
        const messages = readMessages();
        res.render('chat', { username, messages });
    }
});

app.post('/send', (req, res) => {
    const username = req.cookies.username;
    const message = req.body.message;

    if (username && message) {
        appendMessage(username, message);
    }

    res.redirect('/');
});

app.post('/contact', (req, res) => {
    res.send('Contact form submitted successfully!');
})

app.get('/contact', (req, res) => {
    res.render('contact');
})

function readMessages() {
    try {
        const data = fs.readFileSync('messages.txt', 'utf-8');
        const messages = data.split('\n').filter((msg) => msg.trim() !== '');

        return messages.map((msg) => {
            const parseMsg = JSON.parse(msg);
            return { username: parseMsg.username, message: parseMsg.message };
        });
    } catch (error) {
        console.error('Error reading message: ', error);
        return [];
    }
}

const appendMessage = (username, message) => {
    const newMessage = { username, message };
    fs.appendFileSync('messages.txt', JSON.stringify(newMessage) + '\n');
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
