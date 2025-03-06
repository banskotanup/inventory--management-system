require("dotenv").config();
const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");

app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`); 
});