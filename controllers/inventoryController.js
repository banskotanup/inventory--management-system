const db = require("../db/inventory");

exports.getInventory = async (req, res) => {
    res.render("./inventory/inventory", {
        title: "Our Inventory",
        items: await db.getInventory()
    });
};