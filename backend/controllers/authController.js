const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    console.log('Registering:', username, email, password);  // log incoming data
    const newUser = new User({ email, password, username });
    await newUser.save();
    res.status(201).json({ user: newUser });
  } catch (err) {
    console.error('Registration error:', err);  // log real error
    res.status(400).json({ message: 'Registration failed', error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);  // log email

    const user = await User.findOne({ email, password });
    console.log('User found:', user); // log user

    if (!user) {
      console.log('Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Creating token with secret:', process.env.JWT_SECRET);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
