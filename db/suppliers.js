const pool = require("../db/pool");

exports.getSuppliers = async () => {
    const { rows } = await pool.query(`SELECT * FROM suppliers
            ORDER BY id ASC
        `);
    return rows;
}

exports.insertSuppliers = async (name, contact_person, email, phone, address) => {
    await pool.query(`INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES ($1, $2, $3, $4, $5)`, [name, contact_person, email, phone, address]);
}

exports.getSupplier = async (id) => {
    const { rows } = await pool.query(`SELECT * FROM suppliers WHERE id = $1`, [id]);
    return rows[0];
};

exports.postSupplier = async (id, {name, contact_person, email, phone, address}) => {
    await pool.query(`UPDATE suppliers 
            SET name = $1, contact_person = $2, email = $3, phone = $4, address = $5
            WHERE id = $6`,
            [name, contact_person, email, phone, address, id]
        );
};

exports.deleteSupplier = async (id) => {
    await pool.query(`DELETE FROM suppliers
            WHERE id = $1`,
        [id]
    );
}