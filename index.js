import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
  const { method, id, params } = req.body;

  console.log("Incoming MCP:", method);

  // 1️⃣ MCP initialize handshake
  if (method === "initialize") {
    return res.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "strategic-pattern-lab",
          version: "1.0.0"
        }
      }
    });
  }

  // 2️⃣ Tool list
  if (method === "tools/list") {
    return res.json({
      jsonrpc: "2.0",
      id,
      result: {
        tools: [
          {
            name: "analyze_conflict",
            description: "Analyze a military conflict in structured format",
            input_schema: {
              type: "object",
              properties: {
                conflict_name: { type: "string" }
              },
              required: ["conflict_name"]
            }
          }
        ]
      }
    });
  }

  // 3️⃣ Tool call
  if (method === "tools/call") {
    const conflict = params?.arguments?.conflict_name;

    return res.json({
      jsonrpc: "2.0",
      id,
      result: {
        content: [
          {
            type: "text",
            text: `Strategic analysis of ${conflict}`
          }
        ]
      }
    });
  }

  return res.status(400).json({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: "Method not found" }
  });
});

// GET root için 200 döndür (404 olmasın)
app.get("/", (req, res) => {
  res.send("MCP Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP running on port ${PORT}`);
});