import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze_conflict", async (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port 3000");
});