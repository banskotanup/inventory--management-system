const { Router } = require("express");
const inventoryController = require("../controllers/inventoryController");
const inventoryRouter = Router();

inventoryRouter.get("/", inventoryController.getInventory);
inventoryRouter.post("/add_category", inventoryController.addCategory);
inventoryRouter.post("/add", inventoryController.addItem);
inventoryRouter.post("/:id/update", inventoryController.updateInventory);
inventoryRouter.post("/:id/delete", inventoryController.deleteItem);

module.exports = inventoryRouter;