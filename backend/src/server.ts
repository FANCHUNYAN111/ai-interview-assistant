
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
dotenv.config();

const app = express();

// app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use(
  "/api/conversations",
  conversationRoutes
);
app.use(
  cors({
    origin: [
      "http://localhost:5173",

      "https://ai-interview-assistant.up.railway.app/",
    ],

    credentials: true,
  })
);
app.use(express.json());


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});