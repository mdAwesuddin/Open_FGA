import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import { getUserRoles } from "./fgaService.js";

// In-memory users (replace with DB in production)
const users = [
  { id: "zebra", animal: "zebra", passwordHash: bcrypt.hashSync("zebra123", 10) },
  { id: "tiger", animal: "tiger", passwordHash: bcrypt.hashSync("tiger123", 10) },
  { id: "lion",  animal: "lion",  passwordHash: bcrypt.hashSync("lion123", 10) }
];

export async function registerUser(animal, password) {
  const existing = users.find((u) => u.animal === animal);
  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: animal, animal, passwordHash: hashedPassword }; // fixed
  users.push(user);
  return user;
}

export async function loginUser(animal, password) {
  const user = users.find(u => u.animal === animal);
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error("Invalid credentials");

  const token = generateToken(user.id);
  const roles = await getUserRoles(user.id);

  return { token, roles };
}
