const admin = require('firebase-admin');
const User = require('../models/User');

// Middleware to verify Firebase ID token
exports.verifyToken = async (req, res, next) => {
  try {
    console.log('[AUTH] Verifying token for:', req.method, req.url);
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[AUTH] No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const idToken = authHeader.split(' ')[1];
    console.log('[AUTH] Token found, verifying with Firebase...');
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('[AUTH] Token verified for user:', decodedToken.email);
      req.user = decodedToken;
      
      // Check if user exists in our database, if not create one
      console.log('[AUTH] Checking MongoDB for user...');
      let user = await User.findOne({ uid: decodedToken.uid });
      
      if (!user) {
        console.log('[AUTH] User not found in DB, creating...');
        user = new User({
          uid: decodedToken.uid,
          email: decodedToken.email,
          displayName: decodedToken.name || '',
          photoURL: decodedToken.picture || ''
        });
        await user.save();
        console.log('[AUTH] User created in DB');
      } else {
        console.log('[AUTH] User found in DB:', user.email);
      }
      
      req.user.dbUser = user;
      // Attach convenient id alias for downstream controllers
      // so they can use req.user.id (Mongo _id as string)
      if (user && user._id) {
        req.user.id = user._id.toString();
      }
      console.log('[AUTH] Authentication successful, calling next()');
      next();
    } catch (error) {
      console.error('[AUTH] Error verifying token:', error.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('[AUTH] Middleware error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to check if user has admin role
exports.isAdmin = async (req, res, next) => {
  try {
    // 1) Allow if email matches configured admin email
    const adminEmailEnv = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (adminEmailEnv && req.user && req.user.email && req.user.email.toLowerCase() === adminEmailEnv.toLowerCase()) {
      return next();
    }

    // 2) Fallback to DB role check
    const user = await User.findOne({ uid: req.user.uid });
    if (user && user.role === 'admin') {
      return next();
    }

    return res.status(403).json({ message: 'Admin access required' });
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to check if user is authenticated and verified
exports.isAuthenticated = async (req, res, next) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const user = await User.findOne({ uid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    req.user.dbUser = user;
    next();
  } catch (error) {
    console.error('Authentication check error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
