import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, authorization denied.' });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ message: 'Token verification failed, authorization denied.' });
    }
    req.user = verified.id;
    req.usertype = verified.usertype;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or expired.' });
  }
};

export const adminAuth = async (req, res, next) => {
  auth(req, res, () => {
    if (req.usertype !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    next();
  });
};
