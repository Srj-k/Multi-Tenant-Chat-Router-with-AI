import express from "express";
import messageRoutes from "./routes/message.routes";
import authRoutes from "./routes/auth.routes";
import agentRoutes from "./routes/agents.routes";
import adminRoutes from "./routes/admin.routes";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use("/api/messages", messageRoutes);
app.use("/api/login", authRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
``;
