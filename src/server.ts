import express from "express";
import cors from "cors";
import messageRoutes from "./routes/general.routes";
import authRoutes from "./routes/auth.routes";
import agentRoutes from "./routes/agents.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", messageRoutes);
app.use("/api/login", authRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/admin", adminRoutes);

// IMPORTANT: listen on server, NOT app
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
