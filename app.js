//app.js

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const chatController = require('./controllers/chatController');
const db = require('./util/database');
const util = require('util'); // Import util module
const app = express();
const PORT = 5000;

// Promisify the query method
const query = util.promisify(db.query).bind(db);

// Wrap the database query in an asynchronous function
const fetchData = async () => {
  try {
    const result = await query('SELECT * FROM `node-complete`.products');
    return result || []; // Return an empty array if result is undefined
  } catch (err) {
    console.error(err);
    return []; // Return an empty array in case of an error
  }
};

// Use an IIFE to immediately invoke the asynchronous function
(async () => {
  await fetchData();
})();

// Wrap the database query in an asynchronous function

app.get('/', async (req, res) => {
  try {
    const products = await fetchData();
    const username = req.cookies && req.cookies.username;

    res.render('chat', { username: username, messages: [], products: products });
  } catch (error) {
    console.error('Error rendering chat page:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
    const username = req.cookies && req.cookies.username;
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

app.get('/', chatController.renderChatPage);
app.post('/send', chatController.sendMessage);

app.post('/contact', (req, res) => {
    res.send('Contact form submitted!');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
});
