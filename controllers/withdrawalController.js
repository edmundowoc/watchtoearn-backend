import { db } from "../utils/firebase.js";
import { sendEmail } from "../utils/brevo.js";

export const requestWithdrawal = async (req, res) => {
  try {
    const { uid, paypalEmail } = req.body;
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return res.status(404).json({ error: "Nie znaleziono użytkownika" });

    const userData = userSnap.data();
    if (userData.points < 1000)
      return res.status(400).json({ error: "Za mało punktów na wypłatę" });

    const withdrawalRef = await db.collection("withdrawals").add({
      uid,
      paypalEmail,
      points: 1000,
      status: "pending",
      createdAt: new Date().toISOString()
    });

    // Wyślij e-mail do admina
    const adminMsg = `
      <h3>Nowa prośba o wypłatę</h3>
      <p>Użytkownik: ${userData.email}</p>
      <p>PayPal: ${paypalEmail}</p>
      <p>Punkty: ${userData.points}</p>
      <p>ID żądania: ${withdrawalRef.id}</p>
    `;
    await sendEmail(process.env.ADMIN_NOTIFY_EMAIL, "Nowa prośba o wypłatę", adminMsg);

    res.json({ message: "Prośba o wypłatę wysłana" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWithdrawalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const withdrawalRef = db.collection("withdrawals").doc(id);
    const snap = await withdrawalRef.get();
    if (!snap.exists) return res.status(404).json({ error: "Nie znaleziono wypłaty" });

    await withdrawalRef.update({ status });

    const user = (await db.collection("users").doc(snap.data().uid).get()).data();
    const email = user.email;
    let msg = "";

    if (status === "approved") msg = "<p>Twoja wypłata została zatwierdzona ✅</p>";
    else if (status === "rejected") msg = "<p>Twoja wypłata została odrzucona ❌</p>";

    await sendEmail(email, "Status wypłaty", msg);
    res.json({ message: `Status wypłaty zaktualizowany: ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
