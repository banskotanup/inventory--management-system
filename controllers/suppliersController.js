const db = require("../db/suppliers");

exports.getSuppliers = async (req, res) => {
    res.render("./suppliers/supplier_list", {
        title: "Suppliers",
        suppliers: await db.getSuppliers(),
    });
};

exports.supplierAddGet = async (req, res) => {
    res.render("./suppliers/add", {
        title: "Add Suppliers", 
        oldData: '',
        err: '',
    })
};

const { body, validationResult } = require("express-validator");
const nameLenErr = "must not exceed 25 character.";
const emailErr = "must be in email format.";
const phoneErr = "must be 10 characters.";
const addressErr = "must be between 5 to 20 characters.";

const validateSuppliers = [
    body("name").trim()
        .isLength({ max: 25 }).withMessage(`Name ${nameLenErr}.`),
    body("email").trim()
        .isEmail().withMessage(`Email ${emailErr}.`),
    body("phone").trim()
        .isLength({ min: 10, max: 10 }).withMessage(`Phone number ${phoneErr}.`),
    body("address").trim()
        .isLength({ min: 5, max: 20 }).withMessage(`Address ${addressErr}.`),
];


exports.supplierAddPost = [
    validateSuppliers,
    async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            const errMsg = {};
            err.array().forEach(error => {
                if (error.path) {
                    errMsg[error.path] = error.msg;
                }
            });

            return res.status(400).render("./suppliers/add", {
                title: "Add Suppliers",
                err: errMsg,
                oldData: req.body,
            });
        };

        const { name, contact_person, email, phone, address } = req.body;
        try {
            await db.insertSuppliers(name, contact_person, email, phone, address);
            res.redirect("/suppliers");
        } catch (error) {
            let errors = {};
            if (error.code === '23505') {
                if (error.detail.includes('name')) {
                    errors.name = "Suppliers with this name already exists.";
                }
                if (error.detail.includes('email')) {
                    errors.email = "Suppliers with this email already exists.";
                }
                
            } else {
                errors.general = "An unexpected error occurred.";
            }

            res.render("./suppliers/add", {
                title: "Add Suppliers",
                errors: errors,
                oldData: req.body,
                err: '',
            });
        }
    }
];

exports.supplierUpdateGet = async (req, res) => {
    const id = req.params.id;
    res.render("./suppliers/update", {
        title: "Update Suppliers",
        supplier: await db.getSupplier(Number(id)),
        oldData: req.body,
        err: '',
    })
}