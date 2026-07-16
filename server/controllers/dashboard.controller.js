import prisma from "../prisma/client.js";

export async function getDashboard(req, res) {
  try {
    const leads = await prisma.lead.findMany();
    const tasks = await prisma.task.findMany();

    const total = leads.length;
    const won = leads.filter((l) => l.stage === "Won").length;
    const conversionRate = total ? Number(((won / total) * 100).toFixed(1)) : 0;

    const stageCounts = {};
    leads.forEach((l) => {
      stageCounts[l.stage] = (stageCounts[l.stage] || 0) + 1;
    });

    const sourceCounts = {};
    leads.forEach((l) => {
      sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
    });

    const now = new Date();
    const pendingTasks = tasks.filter((t) => t.status !== "Completed");
    const overdueTasks = pendingTasks.filter((t) => new Date(t.dueDate) < now);
    const upcomingTasks = pendingTasks.filter((t) => new Date(t.dueDate) >= now);

    res.json({
      total,
      won,
      conversionRate,
      stageCounts,
      sourceCounts,
      pendingTasksCount: pendingTasks.length,
      overdueTasksCount: overdueTasks.length,
      upcomingTasksCount: upcomingTasks.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard data fetch nahi ho saka" });
  }
}