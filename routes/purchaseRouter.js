const { Router } = require("express");
const purchaseController = require("../controllers/purchaseController");
const purchaseRouter = Router();

purchaseRouter.get("/", purchaseController.getPurchase);
purchaseRouter.get("/add", purchaseController.addPurchaseGet);
purchaseRouter.post("/add", purchaseController.addPurchasePost);

module.exports = purchaseRouter;