const jwt = require('jsonwebtoken');

exports.verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    // console.log('Token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded token:', decoded);
    
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized as admin' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
};