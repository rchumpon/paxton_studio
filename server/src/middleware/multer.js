const multer = require("multer");

// Store uploaded images temporarily in memory
const storage = multer.memoryStorage();

// Configure Multer
const upload = multer({
  storage,

  // Limit each image to 5 MB
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  // Allow image uploads only
  fileFilter: (req, file, callback) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Only JPG, PNG, and WebP images are allowed"));
    }
  },
});
module.exports = upload;

/*
const multer = require("multer");

// Configure storage for uploaded files
const storage = multer.diskStorage({
  // Define the uploaded file name
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

// Create Multer upload middleware
const upload = multer({ storage });

module.exports = upload;
*/
