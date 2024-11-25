import express from "express";
import isAuthenticated from "../middlewares/authentication.js";
import { analyzeAppliedJob, applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/applicationController.mjs";
import { multipleUpload } from "../middlewares/multer.js";


const router = express.Router();

router.route("/analyzeapply/:id").post(isAuthenticated, multipleUpload, analyzeAppliedJob);
router.route("/apply/:id").get(isAuthenticated,applyJob)
router.route("/get").get(isAuthenticated,getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus)


export default router; 