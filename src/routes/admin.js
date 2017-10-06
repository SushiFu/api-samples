import express from "express";

import auth from "../server/auth";
import adminCtrl from "../controllers/admin";

const router = express.Router();

router.get("/check", auth.admin(), adminCtrl.check);

export default router;