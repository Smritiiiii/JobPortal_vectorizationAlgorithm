import express from "express";
import { login, logout, register, updateProfile } from "../controllers/userController.js";
import { multipleUpload, singleUpload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/authentication.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/logout").get(logout)

export default router; 