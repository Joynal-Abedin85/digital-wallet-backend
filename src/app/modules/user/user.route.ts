import express from "express";
import {
  getAllUsers,
  getMyProfile,
  registerUser,
  blockUnblockUser,
  approveAgent,
} from "./user.controller";
import { createUserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post("/register", validateRequest(createUserValidation), registerUser);

router.get("/", getAllUsers);
router.get("/me", getMyProfile);
router.patch("/block/:id", blockUnblockUser);
router.patch("/approve/:id", approveAgent);

export const UserRoutes = router;
