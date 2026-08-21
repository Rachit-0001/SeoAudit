const path = require("path");
const dns = require("dns");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const auditRoutes = require("./routes/auditRoutes");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

dotenv.config({
    path: path.join(__dirname, "..", ".env")
});

const app = express();


app.use(cors({
    origin: process.env.CLIENT_URL
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "SEO Auditor API is running"
    });
});

app.use("/api/audit", auditRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(process.env.PORT || 5000, () => {
            console.log(
                `Server running on port ${process.env.PORT || 5000}`
            );
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed");
        console.log(error.message);
    });