// controllers/chatController.js

const { readMessages, appendMessage } = require('../controllers/authController');
const Message = require('../models/Message');
const db = require('../util/database');
const util = require('util');
const query = util.promisify(db.query).bind(db);


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

// Create
const createProduct = async (product) => {
  try {
    const result = await query('INSERT INTO products (name, price) VALUES (?, ?)', [product.name, product.price]);
    console.log('Product created:', result.insertId);
    return result.insertId;
  } catch (err) {
    console.error('Error creating product:', err);
    throw err;
  }
};

// Read
const getAllProducts = async () => {
  try {
    const result = await query('SELECT * FROM products');
    console.log('All Products:', result);
    return result;
  } catch (err) {
    console.error('Error fetching products:', err);
    throw err;
  }
};

// Update
const updateProduct = async (id, updatedProduct) => {
  try {
    const result = await query('UPDATE products SET name = ?, price = ? WHERE id = ?', [
      updatedProduct.name,
      updatedProduct.price,
      id,
    ]);
    console.log('Product updated:', result.affectedRows);
    return result.affectedRows;
  } catch (err) {
    console.error('Error updating product:', err);
    throw err;
  }
};

// Delete
const deleteProduct = async (id) => {
  try {
    const result = await query('DELETE FROM products WHERE id = ?', [id]);
    console.log('Product deleted:', result.affectedRows);
    return result.affectedRows;
  } catch (err) {
    console.error('Error deleting product:', err);
    throw err;
  }
};



module.exports = {
    renderChatPage,
    sendMessage,
   createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
