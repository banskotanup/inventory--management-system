const db = require("../db/queries");

exports.getIndex = async (req, res) => {
    const suppliers = await db.getSuppliers();
    const p_orders = await db.getPurchaseOrder();
    const s_orders = await db.getSalesOrder();

    const supplierWithSno = suppliers.map((supplier, index) => {
        supplier.sno = index + 1;
        return supplier;
    });

    const purchaseWithSno = p_orders.map((order, index) => {
        order.sno = index + 1;
        return order;
    });

    const saleWithSno = s_orders.map((order, index) => {
        order.sno = index + 1;
        return order;
    });

    res.render("./homepage/index", {
        title: "IMS-Home",
        suppliers: supplierWithSno,
        categories: await db.getCategories(),
        items: await db.getItems(),
        p_orders: purchaseWithSno,
        po_items: await db.getPurchaseItem(),
        s_orders: saleWithSno,
        so_items: await db.getSalesItem(),
    });
};
