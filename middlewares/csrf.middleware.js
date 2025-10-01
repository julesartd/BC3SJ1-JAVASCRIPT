const Tokens = require('csrf');
const tokens = new Tokens();

function generateCsrfToken(req, res, next) {
  let secret = req.cookies.csrfSecret;
  if (!secret) {
    secret = tokens.secretSync();
    res.cookie('csrfSecret', secret, { httpOnly: true, sameSite: 'lax' });
  }
  const token = tokens.create(secret);
  res.cookie('csrfToken', token, { sameSite: 'lax' });
  next();
}

function verifyCsrfToken(req, res, next) {
  const secret = req.cookies.csrfSecret;
  const token =
    req.headers['x-csrf-token'] || req.body._csrf || req.cookies.csrfToken;
  if (!secret || !token || !tokens.verify(secret, token)) {
    return res.status(403).json({ message: 'CSRF token invalide' });
  }
  next();
}

module.exports = {
  generateCsrfToken,
  verifyCsrfToken,
};
