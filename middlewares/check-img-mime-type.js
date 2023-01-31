const multer = require("multer");
// const path = require('path')

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpg": "jpg",
    "image/jpeg": "jpg"
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValidMimeType = MIME_TYPE_MAP[file.mimetype];
        let errorMessage = new Error("Invalid mime type");
        if (isValidMimeType) {
            errorMessage = null;
        }
        cb(errorMessage, "./images/products");
    },

    filename: function (req, file, cb) {
        console.log('fileeeeeeeeeeeee', file);
        const fileNeme = Date.now() + '_' + file.originalname;
        cb(null, fileNeme);
    }
})

module.exports = multer({ storage: storage }).single('imagePath');