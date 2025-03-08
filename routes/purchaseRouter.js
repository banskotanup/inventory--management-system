const { Router } = require("express");
const purchaseController = require("../controllers/purchaseController");
const purchaseRouter = Router();

purchaseRouter.get("/", purchaseController.getPurchase);

module.exports = purchaseRouter;