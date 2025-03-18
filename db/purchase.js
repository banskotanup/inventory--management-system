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

exports.getItems = async () => {
    const { rows } = await pool.query(`SELECT name, category_id FROM items`);
    return rows;
};

exports.getCategory = async () => {
    const { rows } = await pool.query(`SELECT * FROM categories`);
    return rows;
};

exports.getSuppliers = async () => {
    const { rows } = await pool.query(`SELECT name FROM suppliers`);
    return rows;
};

exports.addPurchase = async (item, qty, unit_price, total_amount, supplier_name) => {
    const supplierId = await pool.query(`SELECT id FROM suppliers WHERE name = $1`, [supplier_name]);
    const supplier_id = supplierId.rows[0].id;

    let itemId = await pool.query(`SELECT id FROM items WHERE name = $1`, [item]);
    const item_id = itemId.rows[0].id;

    await pool.query(`INSERT INTO purchase_order (supplier_id, total_amount) VALUEs ($1, $2)`, [supplier_id, total_amount]);

    let poId = await pool.query(`SELECT id FROM purchase_order WHERE supplier_id = $1 AND total_amount = $2`, [supplier_id, total_amount]);
    const po_id = poId.rows[0].id;

    await pool.query(`INSERT INTO purchase_order_items (po_id, item_id, qty, unit_price) VALUES ($1, $2, $3, $4)`, [po_id, item_id, qty, unit_price]);
};