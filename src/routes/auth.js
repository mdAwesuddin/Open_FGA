import express from "express";
import { loginUser } from "../services/userService.js";

const router = express.Router();

// POST /auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { animal, password } = req.body;
    if (!animal || !password) {
      return res.status(400).json({ error: "Animal name and password required" });
    }

    const data = await loginUser(animal, password);
    return res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
