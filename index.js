import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// ES Module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Domain verification için
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

// MCP JSON-RPC endpoint (ROOT)
app.post("/", (req, res) => {
  const { method, id, params } = req.body;

  // MCP tool list request
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

  // MCP tool call
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

  // Default fallback
  res.status(400).json({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: "Method not found" }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});