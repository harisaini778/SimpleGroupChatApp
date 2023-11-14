// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser');

// Create an Express application
const app = express();
const PORT = 5000;

// Middleware to parse incoming request bodies (form data)
app.use(bodyParser.urlencoded({ extended: true }));



app.use(cookieParser());

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

// Define a route for handling GET requests to '/login'
app.get('/login', (req, res) => {
    // Render the 'login.ejs' view
    res.render('login'); 
});

// Define a route for handling POST requests to '/login'
app.post('/login', (req, res) => {
    // Extract the 'username' from the request body
    const { username } = req.body;
    
    // Check if a username is provided
    if (username) {
        // Set a cookie named 'username' with the provided username
        res.cookie('username', username);

        // Setting the cookie to expire after 1 hour (3600000 milliseconds)
      res.cookie('username', username, { expires: new Date(Date.now() + 3600000), httpOnly: true });

        
        
        // Redirect the user to the root URL ('/')
        res.redirect('/');
    } else {
        // If no username is provided, redirect back to '/login'
        res.redirect('/login');
    }
});

// Define a route for handling GET requests to the root URL ('/')
app.post('/chat', (req, res) => {
    // Retrieve the username from the cookie (if exists)
    const username = req.cookies && req.cookies.username;

    // If no username is found, redirect to '/login'
    if (!username) {
        res.redirect('/login');
    } else {
        // If username is found, read messages and render the 'chat.ejs' view
        const message = readMessages();
        res.render('chat', { username, message: [] });

    }
});

app.get('/chat', (req, res) => {
    // Retrieve the username from the cookie (if exists)
    const username = req.cookies && req.cookies.username;

    // If no username is found, redirect to '/login'
    if (!username) {
        res.redirect('/login');
    } else {
        // If the username is found, read messages and render the 'chat.ejs' view
        const messages = readMessages();  // Add this line to retrieve messages
        res.render('chat', { username, messages });  // Pass 'messages' variable to the view
    }
});


// Define a route for handling POST requests to '/send'
app.get('/', (req, res) => {
    // Extract username and message from the request body
    const username = req.cookies.username;
    const message = req.body.message;

    // Check if both username and message are provided
    if (username && message) {
        // Append the message to the 'message.txt' file
        appendMessage(username, message);
    }

    // Redirect the user back to the root URL ('/')
    res.redirect('/chat');
});

// Function to read messages from 'messages.txt' file
function readMessages() {
    try {
        // Read the content of 'messages.txt'
        const data = fs.readFileSync('messages.txt', 'utf-8');
        
        // Split the content into an array of messages, filter out empty lines
        const messages = data.split('\n').filter((msg) => msg.trim() !== '');

        // Parse each message as JSON and return an array of message objects
        return messages.map((msg) => {
            const parseMsg = JSON.parse(msg);
            return { username: parseMsg.username, message: parseMsg.message };
        });
    } catch (error) {
        // Handle errors while reading the file
        console.error('Error reading message: ', error);
        return [];
    }
}

// Function to append a new message to 'message.txt' file
const appendMessage = (username, message) => {
    const newMessage = { username, message };
    
    // Append the stringified message object to 'message.txt' followed by a newline
    fs.appendFileSync('message.txt', JSON.stringify(newMessage) + '\n');
}

// Start the server and listen on port 5000
app.listen(PORT, () => {
    console.log(`Server is running on port 5000`);
});
