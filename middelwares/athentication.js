const Jwt = require('jsonwebtoken');
const usermodel = require('../models/models.user'); // सही path रखें
module.exports.Loggined = async function (req, res, next) {
 const token = req.cookies?.token || req.headers['authorization']?.replace('Bearer ', '');
  if (!token) {
    return res.status(400).json({ message: 'User is not login' });
  }

  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET);
    const user = await usermodel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
  return res.status(400).json({ message: 'User not found' });
  }
};