const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({ title: 'Not authorized', message: 'missing token' });
      }
  
      const token = req.headers.authorization.split(' ')[1];
  
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp) {
        return res.status(401).json({ title: 'Not autorized!', message: 'Your session token has expired. Please log in again to continue.' });
      }
  
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        return res.status(401).json({ title: 'Not autorized!', message: 'Your session token has expired. Please log in again to continue.' });
      }
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ title: 'Not Authorized!', message: 'Invalid token' });
        }
        req.user = decoded;
        next();
      });
    } catch (err) {
      return res.status(401).json({ title: 'Not Authorized!', message: 'Invalid token' });
    }
  };

  const checkRole = (allowedRoles) => (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ title: 'Forbidden!', message: 'Sorry, you do not have the necessary permissions to proceed this action.' });
    }
    next();
  };

  module.exports = { verifyJWT, checkRole };