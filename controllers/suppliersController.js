const db = require("../db/suppliers");

exports.getSuppliers = async (req, res) => {
    res.render("./suppliers/supplier_list", {
        title: "Suppliers",
        suppliers: await db.getSuppliers(),
    });
};