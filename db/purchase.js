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
            ORDER BY id ASC
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

exports.getPurchaseOrder = async (id) => {
    const { rows } = await pool.query(`SELECT purchase_order_items.*,
        suppliers.name AS supplier_name, 
        purchase_order.id AS po_id,
        purchase_order.total_amount,
        purchase_order.status,
        items.name AS item_name
        FROM purchase_order_items
        JOIN purchase_order ON purchase_order_items.po_id = purchase_order.id
        JOIN suppliers ON purchase_order.supplier_id = suppliers.id
        JOIN items ON purchase_order_items.item_id = items.id
        WHERE purchase_order_items.id = $1`, [id]
    );
    return rows[0];
};

exports.updatePurchase = async (id, { item, pOrder_id, qty, unit_price, total_amount, supplier_name, status }) => {
    const supplierId = await pool.query(`SELECT id FROM suppliers WHERE name = $1`, [supplier_name]);
    const supplier_id = supplierId.rows[0].id;

    await pool.query(`UPDATE purchase_order SET supplier_id = $1,
         total_amount = $2, status = $3 WHERE id = $4`, [supplier_id, total_amount, status, pOrder_id]);

    const poId = await pool.query(`SELECT id FROM purchase_order WHERE supplier_id = $1 AND total_amount = $2`, [supplier_id, total_amount]);
    const po_id = poId.rows[0].id;

    const itemId = await pool.query(`SELECT id FROM items WHERE name = $1`, [item]);
    const item_id = itemId.rows[0].id;

    await pool.query(`UPDATE purchase_order_items
            SET po_id = $1,
            item_id = $2,
            qty = $3, 
            unit_price = $4
            WHERE id = $5
        `, [po_id, item_id, qty, unit_price, id]);
};

exports.deletePurchase = async (id) => {
    const { rows } = await pool.query(`SELECT purchase_order_items.*, 
            purchase_order.id AS po_id
            From purchase_order_items
            JOIN purchase_order ON purchase_order_items.po_id = purchase_order.id
            WHERE purchase_order_items.id = $1
        `, [id]);
    
    const po_id  = rows[0].po_id;
    await pool.query(`DELETE FROM purchase_order WHERE  id = $1`, [po_id]);
    await pool.query(`DELETE FROM purchase_order_items WHERE id = $1`, [id]);
    
    return rows[0];
};