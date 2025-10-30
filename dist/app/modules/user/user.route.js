"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
router.post("/register", (0, validateRequest_1.default)(user_validation_1.createUserValidation), user_controller_1.registerUser);
router.get("/", user_controller_1.getAllUsers);
router.get("/me", user_controller_1.getMyProfile);
router.patch("/block/:id", user_controller_1.blockUnblockUser);
router.patch("/approve/:id", user_controller_1.approveAgent);
exports.UserRoutes = router;
