import express from "express";
import authenticateJWT from "../middleware/auth.js";
import { checkDashboardAccess } from "../services/fgaService.js";

const router = express.Router();

// GET /dashboard
router.get("/", authenticateJWT, async (req, res, next) => {
  try {
    const userId = req.user.sub;

    const allowed = await checkDashboardAccess(userId);
    if (!allowed) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({ message: `✅ Welcome ${userId}, you can access the dashboard.` });
  } catch (err) {
    next(err);
  }
});

export default router;
