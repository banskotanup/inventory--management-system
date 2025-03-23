const pool = require("../db/pool");

exports.getInventory = async () => {
    const { rows } = await pool.query(`SELECT ITEMS.*,
            categories.category_name,
            suppliers.name AS supplier_name
            FROM items
            JOIN categories ON items.category_id = categories.id
            JOIN suppliers ON items.supplier_id = suppliers.id
            ORDER BY id DESC
        `)  
    
    return rows;
};

exports.addCategory = async (name, desc) => {
    await pool.query(`INSERT INTO categories (category_name, description) VALUES ($1, $2)`, [name, desc]);
};

exports.getCategory = async () => {
    const { rows } = await pool.query(`SELECT * FROM categories`);
    return rows;
};

exports.addItem = async (name, sku, desc, item_image, category_name, supplier_name, qty, unit_price) => {
    const categoryId = await pool.query(`SELECT id FROM categories WHERE category_name = $1`, [category_name]);
    const category_id = categoryId.rows[0].id;

    const supplierId = await pool.query(`SELECT id FROM suppliers WHERE name = $1`, [supplier_name]);
    const supplier_id = supplierId.rows[0].id;

    await pool.query(`INSERT INTO items (name, sku, description, item_image, category_id, supplier_id, unit_price, qty_in_stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [name, sku, desc, item_image, category_id, supplier_id, unit_price, qty]);
};

exports.getSuppliers = async () => {
    const { rows } = await pool.query(`SELECT * FROM suppliers`);
    return rows;
};

exports.updateItem = async (id, { name, sku, desc, item_image, category_name, supplier_name, qty, unit_price }) => {
    const categoryId = await pool.query(`SELECT id FROM categories WHERE category_name = $1`, [category_name]);
    const category_id = categoryId.rows[0].id;

    const supplierId = await pool.query(`SELECT id FROM suppliers WHERE name = $1`, [supplier_name]);
    const supplier_id = supplierId.rows[0].id;

    await pool.query(`UPDATE items SET
            name = $1, sku = $2, description = $3, item_image = $4,
            category_id = $5, supplier_id = $6, qty_in_stock = $7, unit_price = $8
            WHERE id = $9
        `, [name, sku, desc, item_image, category_id, supplier_id, qty, unit_price, id]);
};

exports.getImage = async (id) => {
    const { rows } = await pool.query(`SELECT item_image FROM items WHERE id = $1`, [id]);
    return rows[0].item_image;
};

exports.deleteItems = async (id) => {
    await pool.query(`DELETE FROM items WHERE id = $1`, [id]);
};
