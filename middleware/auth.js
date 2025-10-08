import jwt from "jsonwebtoken";

export function verifyAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Brak tokenu" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") return res.status(403).json({ error: "Brak uprawnień" });
    req.admin = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Nieprawidłowy token" });
  }
}
