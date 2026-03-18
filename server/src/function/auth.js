const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ ok: false, message: "No token" });
  const token = authHeader.split(" ")[1]; // Bearer <token>
  try {

    req.user = jwt.verify(token, process.env.JWT_SECRET || "changeme");
    next();
  } catch (e) {
    res.status(401).json({ ok: false, message: "Invalid token" });
  }
}

module.exports = auth;

