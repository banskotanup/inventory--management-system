const pool = require("../db/pool");

exports.getSuppliers = async () => {
    const { rows } = await pool.query(`SELECT * FROM suppliers`);
    return rows;
}

exports.insertSuppliers = async (name, contact_person, email, phone, address) => {
    await pool.query(`INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES ($1, $2, $3, $4, $5)`, [name, contact_person, email, phone, address]);
}

exports.getSupplier = async (id) => {
    const { rows } = await pool.query(`SELECT * FROM suppliers WHERE id = $1`, [id]);
    return rows[0];
};