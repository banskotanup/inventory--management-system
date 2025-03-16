const { Router } = require("express");
const suppliersController = require("../controllers/suppliersController");
const suppliersRouter = Router();

suppliersRouter.get("/", suppliersController.getSuppliers);
suppliersRouter.get("/add", suppliersController.supplierAddGet);
suppliersRouter.post("/add", suppliersController.supplierAddPost);
suppliersRouter.get("/:id/update", suppliersController.supplierUpdateGet);
suppliersRouter.post("/:id/update", suppliersController.supplierUpdatePost);
suppliersRouter.post("/:id/delete", suppliersController.deleteSupplier);

module.exports = suppliersRouter;