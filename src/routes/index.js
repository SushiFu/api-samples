import express from "express";

import config from "../server/config";
import healthCtrl from "../controllers/health";

import authRoutes from "./auth";
import userRoutes from "./users";
import profileRoutes from "./profiles";
import feedbackRoutes from "./feedbacks";
import devRoutes from "./dev";
import adminRoutes from "./admin";

const router = express.Router();

router.get("/", healthCtrl.healthCheck);

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/profiles", profileRoutes);
router.use("/feedbacks", feedbackRoutes);

if (config.NODE_ENV === "development" || config.NODE_ENV === "test") {
    router.use("/dev", devRoutes);
}

export default router;
