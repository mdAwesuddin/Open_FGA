import express from "express";
import { loginUser, registerUser } from "../services/userService.js";
import { assignRole } from "../services/fgaService.js";

const router = express.Router();

// POST /auth/signup
router.post("/signup", async (req, res, next) => {
  try {
    const { animal, password, role } = req.body;

    if (!animal || !password || !role) {
      return res.status(400).json({ error: "Animal, password and role required" });
    }

    const user = await registerUser(animal, password);
    const result = await assignRole(user.id, role);

    return res.status(201).json({
      message: result.message,
      user: { animal: user.animal, role },
    });
  } catch (err) {
    if (err.message === "User already exists") {
      return res.status(400).json({ error: "User already exists" });
    }
    next(err);
  }
});


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
