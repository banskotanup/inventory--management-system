const { Router } = require("express");
const salesController = require("../controllers/salesController");
const salesRouter = Router();

salesRouter.get("/", salesController.getSales);
salesRouter.get("/add", salesController.salesAddGet);
salesRouter.post("/add", salesController.salesAddPost);
salesRouter.get("/:id/update", salesController.salesUpdateGet);
salesRouter.post("/:id/update", salesController.salesUpdatePost);
salesRouter.post("/:id/delete", salesController.deleteSales);

module.exports = salesRouter;