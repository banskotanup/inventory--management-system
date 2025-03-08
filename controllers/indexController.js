const db = require("../db/queries");

exports.getIndex = async (req, res) => {
    res.render("./homepage/index", {
        title: "IMS-Home",
        suppliers: await db.getSuppliers(),
        categories: await db.getCategories(),
        items: await db.getItems(),
        p_orders: await db.getPurchaseOrder(),
        po_items: await db.getPurchaseItem(),
        s_orders: await db.getSalesOrder(),
        so_items: await db.getSalesItem(),
    });
};
