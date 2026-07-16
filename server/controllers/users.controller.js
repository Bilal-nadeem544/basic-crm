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