"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadResource = exports.uploadVideo = exports.uploadImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Store files locally
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../../public/uploads');
        if (!fs_1.default.existsSync(uploadPath))
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
    fileFilter: (_req, file, cb) => {
        const allowed = /jpg|jpeg|png|gif|webp|mp4|mov|avi|pdf|doc|docx/;
        const ext = path_1.default.extname(file.originalname).toLowerCase().replace('.', '');
        if (allowed.test(ext))
            cb(null, true);
        else
            cb(new Error('Invalid file type'));
    },
});
const getLocalUrl = (req, filename) => {
    const host = process.env.NODE_ENV === 'production' ? req.get('host') : 'localhost:5000';
    const protocol = req.protocol;
    return `${protocol}://${host}/uploads/${filename}`;
};
// @desc  Upload image (thumbnail)
// @route POST /api/upload/image
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No file uploaded.' });
            return;
        }
        res.json({ success: true, url: getLocalUrl(req, req.file.filename), publicId: req.file.filename });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Upload failed.' });
    }
};
exports.uploadImage = uploadImage;
// @desc  Upload video
// @route POST /api/upload/video
const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No file uploaded.' });
            return;
        }
        // Note: Local storage doesn't auto-calculate duration like Cloudinary does.
        // For a mock, we can set duration to null or 0, or calculate it on the frontend.
        res.json({ success: true, url: getLocalUrl(req, req.file.filename), publicId: req.file.filename, duration: 0 });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Upload failed.' });
    }
};
exports.uploadVideo = uploadVideo;
// @desc  Upload PDF/resource
// @route POST /api/upload/resource
const uploadResource = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No file uploaded.' });
            return;
        }
        res.json({ success: true, url: getLocalUrl(req, req.file.filename), publicId: req.file.filename });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Upload failed.' });
    }
};
exports.uploadResource = uploadResource;
//# sourceMappingURL=upload.controller.js.map