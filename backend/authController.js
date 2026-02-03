const jwt = require('jsonwebtoken');
const User = require('./user');
const bcrypt = require('bcrypt');

const SECRET = 'your_jwt_secret_key';

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();
    if(!user) return res.status(400).json({message:"cant save"});
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
    console.log("hi");
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    console.log("hi");
  } catch (error) {
  console.error("Registration error:", error);
  res.status(500).json({ message: error.message });
}

};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
