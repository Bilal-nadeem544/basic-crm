import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

const cookieOptions = {
  httpOnly: true,
  secure: false, // production mein true (HTTPS ke sath)
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din
};

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, aur password zaroori hain" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Ye email pehle se registered hai" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Signup se hamesha "staff" (team member) account banta hai.
    // Client agar request body mein role bhejay bhi, use jaan boojh kar ignore kiya ja raha hai
    // taake koi bhi khud ko admin na bana sake. Admin sirf seed script se banta hai.
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "staff" },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup fail ho gaya" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email aur password zaroori hain" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email ya password ghalat hai" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ya password ghalat hai" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login fail ho gaya" });
  }
}

export async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token nahi mila" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ message: "Refresh token invalid ho chuka hai" });
    }

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: "Refresh token invalid ya expired hai" });
  }
}

export async function logout(req, res) {
  res.clearCookie("refreshToken", cookieOptions);
  res.json({ message: "Logout ho gaya" });
}

export async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Kuch ghalat ho gaya" });
  }
}