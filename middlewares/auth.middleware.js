const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Accès interdit');
  }
  next();
}

// Middleware combiné
function requireAuthAdmin(req, res, next) {
  authenticateToken(req, res, function () {
    isAdmin(req, res, next);
  });
}

module.exports = {
  authenticateToken,
  isAdmin,
  requireAuthAdmin,
};
