const { end } = require("../db/pool");
const db = require("../db/purchase");

exports.getPurchase = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const p_orders = await db.getPurchase();

    const totalOrders = p_orders.length;
    const totalPage = Math.ceil(totalOrders / limit);


    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginateOrders = p_orders.slice(startIndex, endIndex);

    p_ordersWithSno = paginateOrders.map((p_order, index) => {
        p_order.sno = index + 1;
        return p_order;
    });

    res.render("./purchase/list", {
        title: "Purchase Order",
        p_orders: p_ordersWithSno,
        currentPage: page,
        totalPage: totalPage,
        hasPrev: page > 1,
        hasNext: page < totalPage,
    });
};

exports.addPurchaseGet = async (req, res) => {
    res.render("./purchase/add", {
        title: "Add Purchase",
        categories: await db.getCategory(),
        items: await db.getItems(),
        suppliers: await db.getSuppliers(),
    });
};

exports.addPurchasePost = async (req, res) => {
    const { item, qty, unit_price, total_amount, supplier_name } = req.body;
    await db.addPurchase(item, qty, unit_price, total_amount, supplier_name);
    res.redirect("/purchase");
};

exports.updatePurchaseGet = async (req, res) => {
    const { id } = req.params;

    res.render("./purchase/update", {
        title: "Update Purchase",
        orders: await db.getPurchaseOrder(Number(id)),
        categories: await db.getCategory(),
        items: await db.getItems(),
        suppliers: await db.getSuppliers(),
    });
};

exports.updatePurchasePost = async (req, res) => {
    const { item, pOrder_id, qty, unit_price, total_amount, supplier_name, status } = req.body;
    await db.updatePurchase(req.params.id, { item, pOrder_id, qty, unit_price, total_amount, supplier_name, status });
    res.redirect("/purchase");
};

exports.deletePurchase = async (req, res) => {
    const id = req.params.id;
    await db.deletePurchase(id);
    res.redirect("/purchase");
};