const db = require("../db/inventory");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

exports.getInventory = async (req, res) => {
    res.render("./inventory/inventory", {
        title: "Our Inventory",
        items: await db.getInventory(),
        category: await db.getCategory(),
        suppliers: await db.getSuppliers(),
    });
};

exports.addCategory = async (req, res) => {
    const { name, desc } = req.body;
    await db.addCategory(name, desc);
    res.redirect("/inventory");
};

exports.addItem = async (req, res) => {
    upload.single("item_image")(req, res, async () => {
    const { name, sku, desc, category_name, supplier_name, qty, unit_price } = req.body;
    const item_image = req.file ? `/uploads/${req.file.filename}` : null;
    await db.addItem(name, sku, desc, item_image, category_name, supplier_name, qty, unit_price);
    res.redirect("/inventory");
    });  
};

exports.updateInventory = async (req, res) => {
    const existingItemImage = await db.getImage(req.params.id);
    upload.single("item_image")(req, res, async () => {
        const { name, sku, desc, category_name, supplier_name, qty, unit_price } = req.body;
        const item_image = req.file ? `/uploads/${req.file.filename}` : existingItemImage;
        await db.updateItem(req.params.id, {name, sku, desc, item_image, category_name, supplier_name, qty, unit_price});
        res.redirect("/inventory");
    });
};

exports.deleteItem = async (req, res) => {
    await db.deleteItems(req.params.id);
    res.redirect("/inventory");
};


