import express from "express";
import { requestWithdrawal, updateWithdrawalStatus } from "../controllers/withdrawalController.js";
import { verifyAdmin } from "../middleware/auth.js";
import { db } from "../utils/firebase.js";

const router = express.Router();

router.post("/", requestWithdrawal);
router.put("/:id", verifyAdmin, updateWithdrawalStatus);

// Lista wypłat (dla panelu admina)
router.get("/debug/list", verifyAdmin, async (req, res) => {
  try {
    const qs = await db.collection("withdrawals").orderBy("createdAt", "desc").get();
    const items = qs.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
