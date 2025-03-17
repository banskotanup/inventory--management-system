const db = require("../db/purchase");

exports.getPurchase = async (req, res) => {
    p_orders = await db.getPurchase();

    p_ordersWithSno = p_orders.map((p_order, index) => {
        p_order.sno = index + 1;
        return p_order;
    });

    res.render("./purchase/list", {
        title: "Purchase Order",
        p_orders: p_ordersWithSno,
    });
};

exports.addPurchaseGet = async (req, res) => {
    res.render("./purchase/add", {
        title: "Add Purchase",
    });
};

exports.addPurchasePost = async (req, res) => {
    const { item, qty, unit_price, total_amount, supplier_name } = req.body;
    await db.addPurchase(item, qty, unit_price, total_amount, supplier_name);
    res.redirect("/purchase");
};