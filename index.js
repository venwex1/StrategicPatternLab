import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// ES Module için __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .well-known klasörünü public yap
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

// POST /analyze_conflict
app.post("/analyze_conflict", (req, res) => {
  const { conflict_name } = req.body;
  const structuredResponse = `
1. Strategic Objective
Explain the primary objective of ${conflict_name}.

2. Force Balance
Describe the relative military strength.

3. Logistics Sustainability
Assess supply and sustainability factors.

4. Operational Tempo
Analyze maneuver speed and initiative.

5. Breaking Point
Identify decisive turning points.

6. Strategic Lesson
Summarize key strategic insights.
  `;
  res.json({ result: structuredResponse });
});

// GET /list_tools (MCP taraması için)
app.get("/list_tools", (req, res) => {
  res.json({
    tools: [
      {
        name: "analyze_conflict",
        description: "Analyze a military conflict in structured format",
        input: { conflict_name: "string" },
        output: { result: "string" },
      },
    ],
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});