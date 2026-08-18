import prisma from "../prisma/client.js";

export async function getCompanySettings(req, res) {
  try {
    let settings = await prisma.companySettings.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await prisma.companySettings.create({
        data: { id: 1, name: "Ingenious CRM", logo: null },
      });
    }
    res.json({ settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Company settings fetch nahi ho sake" });
  }
}

export async function updateCompanySettings(req, res) {
  try {
    const { name, logo } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Company name khali nahi ho sakta" });
    }

    const settings = await prisma.companySettings.upsert({
      where: { id: 1 },
      update: { name: name.trim(), ...(logo !== undefined ? { logo } : {}) },
      create: { id: 1, name: name.trim(), logo: logo || null },
    });

    res.json({ settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Company settings update nahi ho sake" });
  }
}