import { Router } from "express";
import { CategoryController } from "./category.controller";

const router =Router()

router.post("/",CategoryController.handleAddCategory)
router.get("/",CategoryController.handleGetAllCategory)



export const CategoryRoutes = router