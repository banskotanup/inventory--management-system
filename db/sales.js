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
            ORDER BY id ASC
        `);
    
    return rows;
};

exports.getCategories = async () => {
    const { rows } = await pool.query(`SELECT category_name, id FROM categories`);
    return rows;
};

exports.getItems = async () => {
    const { rows } = await pool.query(`SELECT name, category_id FROM items`);
    return rows;
};

exports.addSales = async (customer_name, item, qty, unit_price, total_amount) => {
    await pool.query(`INSERT INTO sales_order (customer_name, total_amount) VALUES ($1, $2)`, [customer_name, total_amount]);
    const soId = await pool.query(`SELECT id FROM sales_order WHERE customer_name = $1 AND total_amount = $2`, [customer_name, total_amount]);
    const so_id = soId.rows[0].id;

    const itemId = await pool.query(`SELECT id FROM items WHERE name = $1`, [item]);
    const item_id = itemId.rows[0].id;

    await pool.query(`INSERT INTO sales_order_items (so_id, item_id, qty, unit_price) VALUES ($1, $2, $3, $4)`, [so_id, item_id, qty, unit_price]);
};

exports.getSale = async (id) => {
    const { rows } = await pool.query(`SELECT sales_order_items.*,
            sales_order.customer_name,
            sales_order.total_amount,
            sales_order.status,
            items.name AS item_name
            FROM sales_order_items
            JOIN sales_order ON sales_order_items.so_id = sales_order.id
            JOIN items ON sales_order_items.item_id = items.id
            WHERE sales_order_items.id = $1
        `, [id]);
    return rows[0];
};

exports.updateSales = async (id, { customer_name, item, so_id, qty, unit_price, total_amount, status }) => {
    await pool.query(`UPDATE sales_order SET 
            customer_name = $1,
            total_amount = $2,
            status = $3
            WHERE id = $4
        `, [customer_name, total_amount, status, so_id]);
    
    const itemId = await pool.query(`SELECT * FROM items WHERE name = $1`, [item]);
    const item_id = itemId.rows[0].id;
    const availableQty = itemId.rows[0].qty_in_stock;
    const finalQty = parseInt(availableQty) - parseInt(qty);

    if (status === 'Completed') {
        await pool.query(`UPDATE items SET qty_in_stock = $1 WHERE id = $2`, [finalQty, item_id]);
    };

    await pool.query(`UPDATE sales_order_items
            SET so_id = $1,
            item_id = $2,
            qty = $3,
            unit_price = $4
            WHERE id = $5
        `, [so_id, item_id, qty, unit_price, id]);
};

exports.deleteSales = async (id, {so_id}) => {
    await pool.query(`DELETE FROM sales_order WHERE id = $1`, [so_id]);
    await pool.query(`DELETE FROM sales_order_items WHERE id = $1`, [id]);
};