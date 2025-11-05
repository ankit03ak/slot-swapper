import User from '../models/User.js';
import { signJwt } from '../utils/jwt.js';

export const signUp = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: 'name, email, password required' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password });
  const token = signJwt({ id: user._id });
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });

  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signJwt({ id: user._id });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
};
