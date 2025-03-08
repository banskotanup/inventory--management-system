const db = require("../db/purchase");

exports.getPurchase = async (req, res) => {
    res.render("./purchase/list", {
        title: "Purchase Order",
        p_orders: await db.getPurchase()
    });
};