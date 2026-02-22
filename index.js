import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
  const { method, id, params } = req.body;

  // Gelen isteği logla (Railway Dashboard'da görmek için)
  console.log(`Gelen Metod: ${method}`, JSON.stringify(params));

  // 1. INITIALIZE
  if (method === "initialize") {
    return res.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {} // İstemciye araç sunabildiğimizi belirtiyoruz
        },
        serverInfo: {
          name: "strategic-pattern-lab",
          version: "1.0.0"
        }
      }
    });
  }

  // 2. LIST TOOLS (Hem tools/list hem listTools'u destekle)
  if (method === "tools/list" || method === "listTools") {
    return res.json({
      jsonrpc: "2.0",
      id,
      result: {
        tools: [
          {
            name: "analyze_conflict",
            description: "Analyze a military conflict in structured format",
            inputSchema: { // Dikkat: input_schema yerine inputSchema (OpenAI standartı)
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

  // 3. CALL TOOL (Hem tools/call hem callTool'u destekle)
  if (method === "tools/call" || method === "callTool") {
    // OpenAI parametreleri genelde doğrudan 'arguments' içinde gönderir
    const conflict = params?.arguments?.conflict_name || params?.conflict_name;
    
    if (!conflict) {
      return res.status(200).json({ // 400 yerine 200 dönüp JSON-RPC hatası vermek daha stabildir
        jsonrpc: "2.0",
        id,
        error: { code: -32602, message: "Invalid params: conflict_name missing" }
      });
    }

    return res.json({
      jsonrpc: "2.0",
      id,
      result: {
        content: [{ type: "text", text: `Strategic analysis of ${conflict} completed.` }]
      }
    });
  }

  // Tanımlanmayan metodlar için 400 yerine JSON-RPC Error dön
  console.warn(`Bilinmeyen metod çağrıldı: ${method}`);
  return res.json({
    jsonrpc: "2.0",
    id: id || null,
    error: { code: -32601, message: `Method '${method}' not found` }
  });
});

app.get("/", (req, res) => res.send("Strategic Pattern Lab MCP is active."));

const PORT = process.env.PORT || 8080; // Railway genelde 8080 bekler
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));