import prisma from "../prisma/client.js";

export async function getActivities(req, res) {
  try {
    const activities = await prisma.activity.findMany({
      where: { leadId: Number(req.params.leadId) },
      include: { loggedBy: { select: { id: true, name: true } } },
      orderBy: { date: "desc" },
    });
    res.json({ activities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Activities fetch nahi ho sakin" });
  }
}

export async function createActivity(req, res) {
  try {
    const { type, summary } = req.body;
    if (!type || !summary) {
      return res.status(400).json({ message: "Type aur summary zaroori hain" });
    }

    const activity = await prisma.activity.create({
      data: {
        leadId: Number(req.params.leadId),
        type,
        summary,
        loggedById: req.user.id,
      },
    });

    res.status(201).json({ activity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Activity create nahi ho saki" });
  }
}

export async function updateActivity(req, res) {
  try {
    const { summary, type } = req.body;
    const activity = await prisma.activity.update({
      where: { id: Number(req.params.id) },
      data: { summary, type },
    });
    res.json({ activity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Activity update nahi ho saki" });
  }
}

export async function deleteActivity(req, res) {
  try {
    await prisma.activity.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Activity delete ho gayi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Activity delete nahi ho saki" });
  }
}