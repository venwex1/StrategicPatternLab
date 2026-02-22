import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // ES Module için gerekli

const app = express();
app.use(cors());
app.use(express.json());

// ES Module için __dirname tanımı
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .well-known klasörünü public yap
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

// ----------------------------
// MCP Initialize handshake (basit başlangıç kontrolü)
app.post("/", (req, res) => {
  const { method, id, params } = req.body;

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

  // ----------------------------
  // tools/list endpoint'ini doğru tanımladık
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

  // ----------------------------
  // tools/call metodu (conflict_name parametresi ile gelen istekleri işliyoruz)
  if (method === "tools/call") {
    const conflict = params?.arguments?.conflict_name;
    if (!conflict) {
      return res.status(400).json({
        jsonrpc: "2.0",
        id,
        error: {
          code: -32000,
          message: "Missing required argument: conflict_name"
        }
      });
    }

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

  return res.status(400).json({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: "Method not found" }
  });
});

// ----------------------------
// GET / (Test ve Debug endpoint)
app.get("/", (req, res) => {
  res.send("MCP Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP running on port ${PORT}`);
});