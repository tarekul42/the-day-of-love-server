import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import userRoute from "./routes/user.route.js";
import letterRoute from "./routes/letter.route.js";
import cookieParser from "cookie-parser";

const app = express();

//  important Middlewares func call --->

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// home Route--->
app.get("/", async (req, res) => {
  try {
    return res.status(200).sendFile(path.join(__dirname, "view", "index.html"));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Anothers Routes ----->
// USer Route --->
app.use("/api/v1", userRoute);
app.use("/api/v1", letterRoute);

// 404 route or false route handle --->
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "Route is undifined",
  });
});

// server error catch up --->

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;
