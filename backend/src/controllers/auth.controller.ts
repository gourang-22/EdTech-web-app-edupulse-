import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign({ id }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions);
};

// @desc  Register a new user
// @route POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'All fields are required.' });
      return;
    }
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ success: false, message: 'Email already registered.' });
      return;
    }
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id.toString());
    res.status(201).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// @desc  Login user
// @route POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }
    const token = generateToken(user._id.toString());
    const userObj = user.toJSON();
    res.json({ success: true, token, user: userObj });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// @desc  Get current user
// @route GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ success: true, user: req.user });
};

// @desc  Update profile
// @route PUT /api/auth/profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

// @desc  Change password
// @route PUT /api/auth/change-password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user!._id).select('+password');
    if (!user || !(await user.comparePassword(currentPassword))) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
};
