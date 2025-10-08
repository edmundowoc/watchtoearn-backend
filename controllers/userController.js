// controllers/userController.js
import { db } from "../utils/firebase.js";

export const createUser = async (req, res) => {
  try {
    const { uid, email, referrerCode } = req.body;
    const userRef = db.collection("users").doc(uid);
    const snap = await userRef.get();
    if (!snap.exists) {
      await userRef.set({
        email,
        points: 0,
        claimedRewards: [],
        referrals: [],
        referrerCode: referrerCode || null,
        referralCreditUntil: referrerCode ? new Date(Date.now() + 1000*60*60*24*30*6).toISOString() : null, // +6 mies.
        createdAt: new Date().toISOString()
      });
    }
    res.status(201).json({ message: "Użytkownik gotowy" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const earnPoints = async (req, res) => {
  try {
    const { uid } = req.params;
    const { amount } = req.body; // np. 3
    if (![1,2,3,5,10].includes(Number(amount))) {
      return res.status(400).json({ error: "Nieprawidłowa liczba punktów" });
    }

    const userRef = db.collection("users").doc(uid);
    const snap = await userRef.get();
    if (!snap.exists) return res.status(404).json({ error: "Użytkownik nie istnieje" });

    const user = snap.data();
    const newPoints = (user.points || 0) + Number(amount);

    // Prosty bonus poleceń +20% przez 6 mies.
    let refBonus = 0;
    if (user.referrerCode && user.referralCreditUntil && new Date(user.referralCreditUntil) > new Date()) {
      refBonus = Math.floor(Number(amount) * 0.2);
      // Zwiększ punkty polecającego:
      const refUserRef = db.collection("users").doc(user.referrerCode);
      const refSnap = await refUserRef.get();
      if (refSnap.exists) {
        await refUserRef.update({ points: (refSnap.data().points || 0) + refBonus });
      }
    }

    await userRef.update({
      points: newPoints,
      lastEarnedAt: new Date().toISOString()
    });

    res.json({ message: "Punkty dodane", added: Number(amount), refBonus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
