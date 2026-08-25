import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";

export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: "asc" },
    });

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Users fetch nahi ho sake" });
  }
}

export async function createUser(req, res) {
  try {
    // Sirf ADMIN member create kar sakta hai
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Sirf admin members create kar sakta hai",
      });
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email aur password zaroori hain",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password kam az kam 6 characters ka hona chahiye",
      });
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({
        message: "Ye email pehle se kisi account mein use ho raha hai",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "staff",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.status(201).json({
      message: "Member successfully create ho gaya",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Member create nahi ho saka",
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name aur email dono zaroori hain",
      });
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing && existing.id !== req.user.id) {
      return res.status(409).json({
        message: "Ye email pehle se kisi aur account mein use ho raha hai",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Profile update nahi ho saka",
    });
  }
}