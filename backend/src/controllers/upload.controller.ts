import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Store files locally
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpg|jpeg|png|gif|webp|mp4|mov|avi|pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error('Invalid file type'));
  },
});

const getLocalUrl = (req: Request, filename: string) => {
  const host = process.env.NODE_ENV === 'production' ? req.get('host') : 'localhost:5000';
  const protocol = req.protocol;
  return `${protocol}://${host}/uploads/${filename}`;
};

// @desc  Upload image (thumbnail)
// @route POST /api/upload/image
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) { res.status(400).json({ success: false, message: 'No file uploaded.' }); return; }
    res.json({ success: true, url: getLocalUrl(req, req.file.filename), publicId: req.file.filename });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed.' });
  }
};

// @desc  Upload video
// @route POST /api/upload/video
export const uploadVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) { res.status(400).json({ success: false, message: 'No file uploaded.' }); return; }
    // Note: Local storage doesn't auto-calculate duration like Cloudinary does.
    // For a mock, we can set duration to null or 0, or calculate it on the frontend.
    res.json({ success: true, url: getLocalUrl(req, req.file.filename), publicId: req.file.filename, duration: 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed.' });
  }
};

// @desc  Upload PDF/resource
// @route POST /api/upload/resource
export const uploadResource = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) { res.status(400).json({ success: false, message: 'No file uploaded.' }); return; }
    res.json({ success: true, url: getLocalUrl(req, req.file.filename), publicId: req.file.filename });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed.' });
  }
};
