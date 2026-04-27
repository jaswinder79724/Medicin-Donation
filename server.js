const express = require("express");
require("dotenv").config(); // 👈 always top

const cors = require("cors");

// routes
const Auth = require("./Routes/Auth");
const donorRoutes = require("./Routes/Doner");
const needyRoutes = require("./Routes/Needy");
const adminRoutes = require("./Routes/admin");
const medicineRoutes = require("./Routes/medicine");

// db connect
require("./model/db");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// test route
app.get("/ping", (req, res) => {
  res.send("pong");
});

// routes
app.use("/Auth", Auth);
app.use("/donor", donorRoutes);
app.use("/needy", needyRoutes);
app.use("/admin", adminRoutes);
app.use("/medicine", medicineRoutes);

// server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});