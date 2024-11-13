const multer = require('multer');
const sharp = require('sharp');

// Configure multer to store uploaded files in memory (as buffer)
const storage = multer.memoryStorage();

// Define the file upload limits and validation rules
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 512 * 1024, // 0,5 MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only JPEG and PNG images
    const allowedTypes = ['image/jpeg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG images are allowed.'));
    }
    cb(null, true); // File is accepted
  },
});

// Function to resize and crop image to 128x128
const resizeAndCropImage = (buffer) => {
  return sharp(buffer)
    .resize(128, 128, {
      fit: sharp.fit.cover, // Crop to fit the 128x128 square
      position: sharp.strategy.entropy, // Best content area crop (center or random)
    })
    .toBuffer();
};

module.exports = {
  upload,
  resizeAndCropImage,
}