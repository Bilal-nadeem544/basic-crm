import prisma from "../prisma/client.js";

export async function getLeads(req, res) {
  try {
    const leads = await prisma.lead.findMany({
      include: { assignedTo: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ leads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Leads fetch nahi ho sake" });
  }
}

export async function getLeadById(req, res) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: Number(req.params.id) },
      include: { assignedTo: { select: { id: true, name: true } } },
    });
    if (!lead) return res.status(404).json({ message: "Lead nahi mila" });
    res.json({ lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lead fetch nahi ho saka" });
  }
}

export async function createLead(req, res) {
  try {
    const { name, company, email, phone, source, assignedToId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name zaroori hai" });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        company: company || null,
        email: email || null,
        phone: phone || null,
        source: source || "Other",
        assignedToId: assignedToId || req.user.id,
      },
      include: { assignedTo: { select: { id: true, name: true } } },
    });

    res.status(201).json({ lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lead create nahi ho saka" });
  }
}

export async function updateLead(req, res) {
  try {
    const { name, company, email, phone, source, stage, assignedToId } = req.body;

    const lead = await prisma.lead.update({
      where: { id: Number(req.params.id) },
      data: { name, company, email, phone, source, stage, assignedToId },
      include: { assignedTo: { select: { id: true, name: true } } },
    });

    res.json({ lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lead update nahi ho saka" });
  }
}

export async function deleteLead(req, res) {
  try {
    await prisma.lead.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Lead delete ho gaya" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lead delete nahi ho saka" });
  }
}

export async function updateLeadStage(req, res) {
  try {
    const { stage } = req.body;
    if (!stage) {
      return res.status(400).json({ message: "Stage zaroori hai" });
    }

    const lead = await prisma.lead.update({
      where: { id: Number(req.params.id) },
      data: { stage, stageChangedAt: new Date() },
      include: { assignedTo: { select: { id: true, name: true } } },
    });

    res.json({ lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Stage update nahi ho saka" });
  }
}