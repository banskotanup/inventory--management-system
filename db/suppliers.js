const pool = require("../db/pool");

exports.getSuppliers = async () => {
    const { rows } = await pool.query(`SELECT * FROM suppliers`);
    return rows;
}