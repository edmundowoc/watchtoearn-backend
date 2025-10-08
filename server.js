import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_, res) => res.send("WatchToEarn backend działa 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`✅ Backend uruchomiony na porcie ${PORT}`));
