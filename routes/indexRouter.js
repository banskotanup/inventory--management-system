const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get("/", indexController.getIndex);
indexRouter.get("/suppliers", indexController.getSuppliers);

module.exports = indexRouter;