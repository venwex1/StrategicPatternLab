import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
  const { method, id, params } = req.body;
  console.log("Received method:", method);

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

  // 2️⃣ Tool list (MCP tools)
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

  // 3️⃣ Tool call (Handle actual tool calls)
  if (method === "tools/call") {
    const conflict = params?.arguments?.conflict_name;

    if (!conflict) {
      return res.status(400).json({
        jsonrpc: "2.0",
        id,
        error: { code: -32000, message: "Missing required argument: conflict_name" }
      });
    }

    // Response after analyzing the conflict
    return res.json({
      jsonrpc: "2.0",
      id,
      result: {
        content: [
          {
            type: "text",
            text: `Strategic analysis of ${conflict} completed.`
          }
        ]
      }
    });
  }

  // Handle unknown methods (default fallback)
  return res.status(400).json({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: "Method not found" }
  });
});

// For GET requests (ensure server responds correctly)
app.get("/", (req, res) => {
  res.send("MCP Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP running on port ${PORT}`);
});