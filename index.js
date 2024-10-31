require('dotenv').config();
const express = require("express");
const cors = require('cors');
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const actionRoutes = require("./routes/actions");
const employeeMngRoutes = require("./routes/employeeMng");
const connectDB = require('./config/db');
const corsOpt = require('./config/cors');
const { verifyToken } = require('./config/jwt');

const app = express();
const PORT = process.env.PORT || 5000;
const IP = '0.0.0.0';

// CORS and static file handling
app.use(cors(corsOpt));
app.use(express.json({ limit: '10mb' })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Increase URL-encoded payload limit
app.use('/uploads', express.static('uploads'));

// DB Connection
connectDB();

// Default route
app.get("/", async (req, res) => res.status(200).send("TPWITS | The Place Where IT Starts"));

// Routes
app.use("/", authRoutes);
app.use("/api", userRoutes);
app.use("/api", verifyToken, actionRoutes);
app.use("/api/employee", verifyToken, employeeMngRoutes);

// Error handling for large payloads
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    res.status(413).json({ message: "File is too large!" });
  } else {
    next(err);
  }
});

// Server start
app.listen(PORT, IP, () => console.log(`Server listening on http://${IP}:${PORT}`));

module.exports = app;
