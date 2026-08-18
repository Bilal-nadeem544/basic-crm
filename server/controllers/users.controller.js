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

export async function updateProfile(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name aur email dono zaroori hain" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== req.user.id) {
      return res.status(409).json({ message: "Ye email pehle se kisi aur account mein use ho raha hai" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile update nahi ho saka" });
  }
}