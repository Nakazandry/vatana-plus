const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const app = express();
const utilisateurRoutes =
require("./routes/utilisateurRoutes");
const programmeRoutes = require("./routes/programmeRoutes");
const exerciceRoutes = require("./routes/exerciceRoutes");
const affectationRoutes = require("./routes/affectationRoutes");
const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const seanceRoutes = require("./routes/seanceRoutes");
const messageRoutes = require("./routes/messageRoutes");

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ||
  "https://vatana-plus.vercel.app,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  next();
});
app.use(cors({
  origin(origin, callback) {
    // Les requêtes sans Origin (health checks, curl, serveur-à-serveur) restent admises.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origine non autorisée par CORS"));
  },
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Vatana+ fonctionne 🚀",
    status: "OK",
  });
});

app.use("/api/auth", authRoutes);
app.use(
  "/api/utilisateurs",
  utilisateurRoutes
);
app.use("/api/programmes", programmeRoutes);
app.use("/api/exercices", exerciceRoutes);
app.use("/api/affectations", affectationRoutes);

app.use("/api/client", clientRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/seances", seanceRoutes);
app.use("/api/messages", messageRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur Vatana+ lancé sur le port ${PORT}`);
});
