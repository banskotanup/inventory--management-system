const { Router } = require("express");
const suppliersController = require("../controllers/suppliersController");
const suppliersRouter = Router();

suppliersRouter.get("/", suppliersController.getSuppliers);

module.exports = suppliersRouter;