const cloudinary = require('../config/cloudinaryConfig');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // File đã được upload lên Cloudinary bởi multer-storage-cloudinary
    // URL của ảnh sẽ có trong req.file.path
    const imageUrl = req.file.path;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
