const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'products',       // ← tên folder trên Cloudinary
        allowed_formats: ['jpg', 'png', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }], // ← auto resize
    },
});

module.exports = multer({ storage });