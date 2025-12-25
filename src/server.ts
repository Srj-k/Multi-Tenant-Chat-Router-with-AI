import express from "express";
import type { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running");
});

app.post("/webhook/message", (req: Request, res: Response) => {
  const { businessId, message } = req.body;
  console.log("incoming message", req.body);

  res.json({ status: "Received" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
