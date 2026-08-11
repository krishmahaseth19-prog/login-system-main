require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/dashboard", authMiddleware, (req, res) => {
    res.render("dashboard", {
        user: req.user
    });
});

app.get("/logout", (req, res) => {

    res.clearCookie("token");

    res.redirect("/");

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});