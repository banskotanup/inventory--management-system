const { Router } = require("express");
const purchaseController = require("../controllers/purchaseController");
const purchaseRouter = Router();

purchaseRouter.get("/", purchaseController.getPurchase);
purchaseRouter.get("/add", purchaseController.addPurchaseGet);
purchaseRouter.post("/add", purchaseController.addPurchasePost);
purchaseRouter.get("/:id/update", purchaseController.updatePurchaseGet);
purchaseRouter.post("/:id/update", purchaseController.updatePurchasePost);
purchaseRouter.post("/:id/delete", purchaseController.deletePurchase);

module.exports = purchaseRouter;