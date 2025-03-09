import express from "express";
import { BuyerController } from "./buyer.controller.js";

const buyerRouter = express.Router();

buyerRouter.get("/get-buyers", BuyerController.getBuyers);
buyerRouter.get("/:id", BuyerController.getSingleBuyers);
buyerRouter.patch("/:id", BuyerController.updateBuyer)
buyerRouter.delete("/:id", BuyerController.deleteBuyer);
buyerRouter.post("/save-favorite-property/:id", BuyerController.saveFavoriteProperty);
buyerRouter.post("/delete-favorite-property/:id", BuyerController.deleteFavoriteProperty);
buyerRouter.delete("/save-search-history/:id", BuyerController.saveSearchHistory);
buyerRouter.delete("/block/:id", BuyerController.blockBuyer);

export const BuyerRoutes = buyerRouter;