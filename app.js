//app.js

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');


const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));


app.get('/login', (req, res) => {
    res.render('login'); 
});


app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username) {
        res.cookie('username', username);
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
        const message = readMessages();
        res.render('chat', { username, message });
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

function readMessages() {
    try {
    const data = fs.readFileSync('messages.txt', 'utf-8');
    const messages = data.split('\n').filter((msg) => msg.trim() !== '');
    return messages.map((msg) => {
        const parseMsg = JSON.parse(msg);
        return { username: parseMsg.username, message: parseMsg.message };
    });
    } catch (error) {
        console.error('Error reading message : ', error);
        return [];
    }
}

const appendMessage = (username, message) => {
    const newMessage = { username, message };
    fs.appendFileSync('message.txt',JSON.stringify(newMessage) + '\n')
}

app.listen(PORT, () => {
    console.log(`Server is running on 5000 Port`)
});
