const pool = require("../db/pool");

exports.getSales = async () => {
    const { rows } = await pool.query(`
            SELECT sales_order_items.*,
            sales_order.customer_name,
            sales_order.total_amount,
            sales_order.order_date,
            sales_order.status,
            items.name AS item_name
            FROM sales_order_items
            JOIN sales_order ON sales_order_items.so_id = sales_order.id
            JOIN items ON sales_order_items.item_id = items.id
        `);
    
    return rows;
};