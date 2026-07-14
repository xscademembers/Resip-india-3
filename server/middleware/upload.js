const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resip-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 10,
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'), false);
    }
  },
});

/**
 * Delete a local image by its URL or filename.
 */
const deleteImage = async (filename) => {
  if (!filename) return;
  try {
    // If a full URL is passed, extract the filename
    const name = filename.split('/').pop();
    const filePath = path.join(uploadDir, name);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Failed to delete image from local storage:', error.message);
  }
};

/**
 * Extract filename from a URL.
 * Designed to act as a drop-in replacement for the old Cloudinary public_id extractor.
 */
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  if (url.includes('/uploads/')) {
    return url.split('/').pop();
  }
  return null;
};

module.exports = { upload, deleteImage, getPublicIdFromUrl };
