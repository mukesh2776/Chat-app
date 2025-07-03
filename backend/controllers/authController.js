const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const newUser = new User({ email, password, username });
    await newUser.save();
    res.status(201).json({ user: newUser });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};
