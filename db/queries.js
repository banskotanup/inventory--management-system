const pool = require("../db/pool");

exports.getSuppliers = async () => {
    const { rows } = await pool.query("SELECT * FROM suppliers ORDER BY id DESC LIMIT 3");
    return rows;
};

exports.getCategories = async () => {
    const { rows } = await pool.query("SELECT * FROM categories");
    return rows;
};

exports.getItems = async () => {
    const { rows } = await pool.query(`SELECT items.*, categories.category_name, suppliers.name AS supplier_name
            FROM items 
            JOIN categories ON items.category_id = categories.id
            JOIN suppliers ON items.supplier_id = suppliers.id
            ORDER BY id DESC LIMIT 8
        `);
    return rows;
};

exports.getPurchaseOrder = async () => {
    const { rows } = await pool.query(`SELECT purchase_order.*, suppliers.name AS supplier_name
            FROM purchase_order
            JOIN suppliers ON purchase_order.supplier_id = suppliers.id
            ORDER BY id DESC LIMIT 5;
        `);
    return rows;
};

exports.getPurchaseItem = async () => {
    const { rows } = await pool.query(`SELECT purchase_order_items.*, purchase_order.id AS po_id, items.name AS item_name 
            FROM purchase_order_items
            JOIN purchase_order ON purchase_order_items.po_id = purchase_order.id
            JOIN items ON purchase_order_items.item_id = items.id
        `);
    
    return rows;
};

exports.getSalesOrder = async () => {
    const { rows } = await pool.query(`SELECT * FROM sales_order ORDER BY id DESC LIMIT 5`);
    return rows;
};

exports.getSalesItem = async () => {
    const { rows } = await pool.query(`SELECT sales_order_items.*,
            sales_order.id as so_id,
            items.name AS item_name
            FROM sales_order_items
            JOIN sales_order ON sales_order_items.so_id = sales_order.id
            JOIN items ON sales_order_items.item_id = items.id
        
        `);
    return rows;
};