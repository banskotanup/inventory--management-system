const db = require("../db/sales");

exports.getSales = async (req, res) => {
    res.render("./sales/list", {
        title: "Sales Order",
        s_orders: await db.getSales(),
    });
};