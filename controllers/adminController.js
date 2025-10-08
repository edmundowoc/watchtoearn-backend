import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  console.log("[ADMIN LOGIN] Otrzymano dane:", req.body);
  console.log("[ADMIN LOGIN] Oczekiwany email:", process.env.ADMIN_EMAIL);
  console.log("[ADMIN LOGIN] Czy hasło istnieje w env:", !!process.env.ADMIN_PASSWORD);

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    console.log("[ADMIN LOGIN] Błędne dane logowania!");
    return res.status(401).json({ error: "Błędne dane logowania" });
  }

  const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  console.log("[ADMIN LOGIN] Sukces! Wydano token.");
  res.json({ token });
};
