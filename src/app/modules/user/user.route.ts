import express from "express";
import {
  getAllUsers,
  getMyProfile,
  registerUser,
  blockUnblockUser,
  approveAgent,
  loginUser,
  updateProfile,
} from "./user.controller";
import { createUserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import { verifyToken } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", validateRequest(createUserValidation), registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/me",verifyToken, getMyProfile);
router.patch("/block/:id", blockUnblockUser);
router.patch("/approve/:id", approveAgent);
router.patch("/update", verifyToken, updateProfile);


export const UserRoutes = router;
