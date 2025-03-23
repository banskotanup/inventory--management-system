const db = require("../db/inventory");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

exports.getInventory = async (req, res) => {
  res.render("./inventory/inventory", {
    title: "Our Inventory",
    items: await db.getInventory(),
    category: await db.getCategory(),
    suppliers: await db.getSuppliers(),
    oldData: "",
    oldImage: "",
    errors: "",
    showAddPopover: false,
    showUpdatePopover: false,
    showAddCategoryPopover: false,
    err: "",
  });
};

const { body, validationResult } = require("express-validator");
const nameErr = `must not exceed 255 characters.`;
const skuErr = `must not exceed 255 characters.`;
const descErr = `must not exceed 255 characters.`;
const priceErr = `must be a decimal number.`;
const qtyErr = `must be a number.`;

const validateItems = [
  body("name").trim().isLength({ max: 255 }).withMessage(`Name ${nameErr}`),
  body("sku").trim().isLength({ max: 255 }).withMessage(`Sku ${skuErr}`),
  body("desc")
    .trim()
    .isLength({ max: 255 })
    .withMessage(`Description ${descErr}`),
];

const validateCategory = [
  body("name").trim()
    .isLength({ max: 255 }).withMessage(`Category name ${nameErr}`),
];

exports.addCategory = [validateCategory,
  async (req, res) => {
    const { name, desc } = req.body;
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const errMsg = {};
      err.array().forEach(error => {
        if (error.path) {
          errMsg[error.path] = error.msg;
        }
      });

      return res.status(400).render("./inventory/inventory", {
        title: "Our Inventory",
        showAddCategoryPopover: true,
        showAddPopover: false,
        showUpdatePopover: false,
        items: await db.getInventory(),
        category: await db.getCategory(),
        suppliers: await db.getSuppliers(),
        oldData: req.body,
        oldImage: ``,
        err: errMsg,
        errors: "",
      });
    }
    try {
      await db.addCategory(name, desc);
      res.redirect("/inventory");
    } catch (error) {
      const errors = {};
      if (error.code === '23505') {
        if (error.detail.includes("name")) {
          errors.name = (`Category name must be unique.`);
        }
      } else {
        error.general = (`An error occurred.`);
      }
      res.render("./inventory/inventory", {
        title: "Our Inventory",
        showAddCategoryPopover: true,
        showAddPopover: false,
        showUpdatePopover: false,
        items: await db.getInventory(),
        category: await db.getCategory(),
        suppliers: await db.getSuppliers(),
        oldData: req.body,
        oldImage: ``,
        errors: errors,
        err: "",
      });
    }
  }
];

exports.addItem = [
  upload.single("item_image"),
  [validateItems],
  async (req, res) => {
    const err = await validationResult(req);
    if (!err.isEmpty()) {
      const errMsg = {};
      err.array().forEach((error) => {
        if (error.path) {
          errMsg[error.path] = error.msg;
        }
      });
      return res.status(400).render("./inventory/inventory", {
        title: "Our Inventory",
        showAddPopover: true,
        showUpdatePopover: false,
        showAddCategoryPopover: false,
        items: await db.getInventory(),
        category: await db.getCategory(),
        suppliers: await db.getSuppliers(),
        oldData: req.body,
        oldImage: `/uploads/${req.file.filename}`,
        err: errMsg,
        errors: "",
      });
    }
    const { name, sku, desc, category_name, supplier_name, qty, unit_price } =
      req.body;
    const item_image = req.file ? `/uploads/${req.file.filename}` : null;
    try {
      await db.addItem(
        name,
        sku,
        desc,
        item_image,
        category_name,
        supplier_name,
        qty,
        unit_price
      );
      res.redirect("/inventory");
    } catch (error) {
      let errors = {};
      if (error.code === "23505") {
        if (error.detail.includes("name")) {
          errors.name = `No duplicate key allowed. Name already exists.`;
        }

        if (error.detail.includes("sku")) {
          errors.sku = `Duplicate sku. Enter a new one.`;
        }
      } else {
        errors.general = `An error occurred. Try again later.`;
      }

      res.render("./inventory/inventory", {
        title: "Our Inventory",
        showAddCategoryPopover: false,
        showAddPopover: true,
        showUpdatePopover: false,
        items: await db.getInventory(),
        category: await db.getCategory(),
        suppliers: await db.getSuppliers(),
        oldData: req.body,
        oldImage: `/uploads/${req.file.filename}`,
        errors: errors,
        err: "",
      });
    }
  },
];

exports.updateInventory = [
  upload.single("item_image"),
  validateItems,
  async (req, res) => {
    const existingItemImage = await db.getImage(req.params.id);
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const errMsg = {};
      err.array().forEach((error) => {
        if (error.path) {
          errMsg[error.path] = error.msg;
        }
      });

      return res.status(400).render("./inventory/inventory", {
        title: "Our Inventory",
        showAddCategoryPopover: false,
        showAddPopover: false,
        showUpdatePopover: true,
        items: await db.getInventory(),
        category: await db.getCategory(),
        suppliers: await db.getSuppliers(),
        oldData: "",
        oldImage: existingItemImage,
        err: errMsg,
        errors: "",
        id: req.params.id,
      });
    }

    const { name, sku, desc, category_name, supplier_name, qty, unit_price } =
      req.body;
    const item_image = req.file
      ? `/uploads/${req.file.filename}`
      : existingItemImage;
    try {
      await db.updateItem(req.params.id, {
        name,
        sku,
        desc,
        item_image,
        category_name,
        supplier_name,
        qty,
        unit_price,
      });
      res.redirect("/inventory");
    } catch (error) {
      let errors = {};
      if ((error.code = "23505")) {
        if (error.detail.includes("name")) {
          errors.name = `Name already exists.`;
        }
        if (error.detail.includes("sku")) {
          errors.sku = `Sku already exists.`;
        }
      } else {
        errors.general = `An error occurred. Try again later.`;
      }

      res.render("./inventory/inventory", {
        title: "Our Inventory",
        showAddPopover: false,
        showUpdatePopover: true,
        showAddCategoryPopover: false,
        items: await db.getInventory(),
        category: await db.getCategory(),
        suppliers: await db.getSuppliers(),
        oldData: "",
        oldImage: existingItemImage,
        err: "",
        errors: errors,
        id: req.params.id,
      });
    }
  },
];

exports.deleteItem = async (req, res) => {
  await db.deleteItems(req.params.id);
  res.redirect("/inventory");
};
