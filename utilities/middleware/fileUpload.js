const multer = require('multer');

// Configure multer (e.g., memory storage)
const upload = multer();

module.exports = {
  upload,
}