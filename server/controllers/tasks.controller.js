import prisma from "../prisma/client.js";

export async function getAllTasks(req, res) {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        lead: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: "asc" },
    });
    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Tasks fetch nahi ho sake" });
  }
}

export async function createTask(req, res) {
  try {
    const { leadId, title, dueDate, assignedToId } = req.body;
    if (!leadId || !title || !dueDate) {
      return res.status(400).json({ message: "leadId, title, aur dueDate zaroori hain" });
    }

    const task = await prisma.task.create({
      data: {
        leadId: Number(leadId),
        title,
        dueDate: new Date(dueDate),
        assignedToId: assignedToId ? Number(assignedToId) : req.user.id,
      },
    });

    res.status(201).json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Task create nahi ho saka" });
  }
}

export async function updateTask(req, res) {
  try {
    const { title, dueDate, assignedToId, status } = req.body;
    const task = await prisma.task.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(title && { title }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(assignedToId && { assignedToId: Number(assignedToId) }),
        ...(status && { status }),
      },
    });
    res.json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Task update nahi ho saka" });
  }
}

export async function completeTask(req, res) {
  try {
    const task = await prisma.task.update({
      where: { id: Number(req.params.id) },
      data: { status: "Completed" },
    });
    res.json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Task complete nahi ho saka" });
  }
}

export async function deleteTask(req, res) {
  try {
    await prisma.task.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Task delete ho gaya" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Task delete nahi ho saka" });
  }
}