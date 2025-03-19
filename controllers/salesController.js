const db = require("../db/sales");

exports.getSales = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const s_orders = await db.getSales();

    const orderPages = s_orders.length;
    const totalPage = Math.ceil(orderPages / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginateOrder = s_orders.slice(startIndex, endIndex);
    

    const orderWithSno = paginateOrder.map((order, index) => {
        order.sno = index + 1;
        return order;
    });

    res.render("./sales/list", {
        title: "Sales Order",
        s_orders: orderWithSno,
        currentPage: page,
        totalPage: totalPage,
        hasPrev: page > 1,
        hasNext: page < totalPage,
    });
};

exports.salesAddGet = async (req, res) => {
    res.render("./sales/add", {
        title: "Add Sales",
        items: await db.getItems(),
        categories: await db.getCategories(),
    });  
};

exports.salesAddPost = async (req, res) => {
    const { customer_name, item, qty, unit_price, total_amount } = req.body;
    await db.addSales(customer_name, item, qty, unit_price, total_amount);
    res.redirect("/sales");
};

exports.salesUpdateGet = async (req, res) => {
    const { id } = req.params;
    res.render("./sales/update", {
        title: "Update Sales",
        orders: await db.getSale(Number(id)),
        items: await db.getItems(),
        categories: await db.getCategories(),
    });  
};

exports.salesUpdatePost = async (req, res) => {
    const { customer_name, item, so_id, qty, unit_price, total_amount, status } = req.body;
    await db.updateSales(req.params.id, { customer_name, item, so_id, qty, unit_price, total_amount, status });
    res.redirect("/sales");
};

exports.deleteSales = async (req, res) => {
    const { so_id } = req.body;
    await db.deleteSales(req.params.id, { so_id });
    res.redirect("/sales");
};