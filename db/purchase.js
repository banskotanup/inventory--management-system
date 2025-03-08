const pool = require("../db/pool");

exports.getPurchase = async () => {
    const { rows } = await pool.query(`SELECT purchase_order_items.*,
            suppliers.name AS supplier_name,
            purchase_order.id AS po_id,
            purchase_order.total_amount AS total_amount,
            purchase_order.order_date,
            purchase_order.status,
            items.name AS item_name
            FROM purchase_order_items
            JOIN purchase_order ON purchase_order_items.po_id = purchase_order.id
            JOIN suppliers ON purchase_order.supplier_id = suppliers.id
            JOIN items ON purchase_order_items.item_id = items.id
        `)
    return rows;
};