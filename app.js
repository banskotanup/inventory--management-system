require("dotenv").config();
const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const suppliersRouter = require("./routes/suppliersRouter");
const inventoryRouter = require("./routes/inventoryRouter");
const purchaseRouter = require("./routes/purchaseRouter");
const salesRouter = require("./routes/salesRouter");

app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use("/uploads", express.static("public/uploads"));

app.use("/", indexRouter);
app.use("/suppliers", suppliersRouter);
app.use("/inventory", inventoryRouter);
app.use("/purchase", purchaseRouter);
app.use("/sales", salesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`); 
});