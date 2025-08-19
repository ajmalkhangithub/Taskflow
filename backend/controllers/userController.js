import User from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your jwt secret is here';
const TOKEN_EXPIRES = '24h';

const createToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

// Registration Function
export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      msg: 'Please enter your name, email, and password',
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      msg: 'Please enter a valid email',
    });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ success: false, msg: 'Password must be at least 8 characters' });
  }

  try {
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ success: false, msg: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: 'Something went wrong' });
  }
}

// Login Function
export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, msg: 'Please fill in all required fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: 'Please register yourself' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, msg: 'Invalid credentials' });
    }

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: 'Something went wrong' });
  }
}

// Get current user
export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select('name email');
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: 'Something went wrong' });
  }
}

// Update user profile
export async function updateProfile(req, res) {
  const { name, email } = req.body;

  if (!name || !email || !validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, msg: 'Valid name and email are required' });
  }

  try {
    const exists = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    });

    if (exists) {
      return res
        .status(409)
        .json({ success: false, msg: 'Email already used by another account' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true, select: 'name email' }
    );

    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: 'Something went wrong' });
  }
}

// Change password
export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res
      .status(400)
      .json({ success: false, msg: 'Password invalid or too short' });
  }

  try {
    const user = await User.findById(req.user.id).select('password');
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: 'User not found' });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, msg: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, msg: 'Password changed successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: 'Something went wrong' });
  }
}
