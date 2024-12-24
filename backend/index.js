import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import txnRoute from "./routes/txnRoute.js";

const app = express();

app.use(express.json({ limit: '20mb' }));

dotenv.config();
const db = process.env.MONGO_URI;

app.use(cors({ origin: "*" }));

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/txn", txnRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
