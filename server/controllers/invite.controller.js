import crypto from "crypto";
import prisma from "../prisma/client.js";
import { sendInviteEmail } from "../services/emailService.js";

export async function createInvite(req, res) {
  try {
    const { email, role = "staff" } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email zaroori hai",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check whether user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Is email ka user already registered hai",
      });
    }

    // Check existing pending invite
    const existingInvite = await prisma.invite.findFirst({
      where: {
        email: normalizedEmail,
        status: "Pending",
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingInvite) {
      return res.status(409).json({
        message: "Is email par already active invite maujood hai",
      });
    }

    // Only allowed roles
    const allowedRoles = ["staff"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // Generate secure random invitation token
    const token = crypto.randomBytes(32).toString("hex");

    // Invite expires after 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const invite = await prisma.invite.create({
      data: {
        email: normalizedEmail,
        role,
        token,
        status: "Pending",
        invitedById: req.user.id,
        expiresAt,
      },
    });

    await sendInviteEmail({
  email: normalizedEmail,
  token,
  role,
});

    res.status(201).json({
      message: "Invite successfully create ho gaya",
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        status: invite.status,
        expiresAt: invite.expiresAt,
      },
      token,
    });
  } catch (err) {
    console.error("Create invite error:", err);

    res.status(500).json({
      message: "Invite create nahi ho saka",
    });
  }
}