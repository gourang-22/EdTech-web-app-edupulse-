"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign({ id }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};
// @desc  Register a new user
// @route POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'All fields are required.' });
            return;
        }
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            res.status(400).json({ success: false, message: 'Email already registered.' });
            return;
        }
        const user = await User_1.default.create({ name, email, password });
        const token = generateToken(user._id.toString());
        res.status(201).json({ success: true, token, user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
};
exports.register = register;
// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required.' });
            return;
        }
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
            return;
        }
        const token = generateToken(user._id.toString());
        const userObj = user.toJSON();
        res.json({ success: true, token, user: userObj });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};
exports.login = login;
// @desc  Get current user
// @route GET /api/auth/me
const getMe = async (req, res) => {
    res.json({ success: true, user: req.user });
};
exports.getMe = getMe;
// @desc  Update profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const user = await User_1.default.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true, runValidators: true });
        res.json({ success: true, user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update profile.' });
    }
};
exports.updateProfile = updateProfile;
// @desc  Change password
// @route PUT /api/auth/change-password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User_1.default.findById(req.user._id).select('+password');
        if (!user || !(await user.comparePassword(currentPassword))) {
            res.status(400).json({ success: false, message: 'Current password is incorrect.' });
            return;
        }
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: 'Password changed successfully.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to change password.' });
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map