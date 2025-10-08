import { db } from "../utils/firebase.js";

export const claimReward = async (req, res) => {
  try {
    const { uid, rewardCode } = req.body;
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return res.status(404).json({ error: "Nie znaleziono użytkownika" });

    const userData = userSnap.data();
    const claimed = userData.claimedRewards || [];
    if (claimed.includes(rewardCode))
      return res.status(400).json({ error: "Ten kod został już odebrany" });

    const cost = 200;
    if (userData.points < cost)
      return res.status(400).json({ error: "Za mało punktów" });

    await userRef.update({
      points: userData.points - cost,
      claimedRewards: [...claimed, rewardCode],
    });

    res.json({ message: `Kod ${rewardCode} został przyznany!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
