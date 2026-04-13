const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadProductImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();

  // 1) Cover image
  if (req.files.imageCover) {
    const coverFilename = `product-${req.params.id || 'new'}-${Date.now()}-cover.jpeg`;
    
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/products/${coverFilename}`);
      
    // Save URL to body
    req.body.imageCover = `${req.protocol}://${req.get('host')}/img/products/${coverFilename}`;
  }

  // 2) Images
  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `product-${req.params.id || 'new'}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/products/${filename}`);

        req.body.images.push(`${req.protocol}://${req.get('host')}/img/products/${filename}`);
      })
    );
  }

  next();
});
