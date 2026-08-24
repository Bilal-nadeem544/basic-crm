import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import leadsRoutes from "./routes/leads.routes.js";
import activitiesRoutes from "./routes/activities.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import usersRoutes from "./routes/users.routes.js";
import companyRoutes from "./routes/company.routes.js";
import inviteRoutes from "./routes/invite.routes.js";

dotenv.config();

const app = express();

console.log("CLIENT_URL:", process.env.CLIENT_URL);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CRM backend running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/crm/leads", leadsRoutes);
app.use("/api/crm/leads/:leadId/activities", activitiesRoutes);
app.use("/api/crm/tasks", tasksRoutes);
app.use("/api/crm/dashboard", dashboardRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/invites", inviteRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});