const pool = require("../db/pool");

exports.getInventory = async () => {
    const { rows } = await pool.query(`SELECT ITEMS.*,
            categories.category_name,
            suppliers.name AS supplier_name
            FROM items
            JOIN categories ON items.category_id = categories.id
            JOIN suppliers ON items.supplier_id = suppliers.id
        `)  
    
    return rows;
};