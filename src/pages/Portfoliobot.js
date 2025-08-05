import React, { useState } from "react";

export default function PortfolioBot() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:5000/api/bedrock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      setResponse(data.output || "No response from AI.");
    } catch (err) {
      console.error(err);
      setResponse("Error calling Bedrock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>📈 Bedrock AI Portfolio Advisor</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: 10 }}
        placeholder="Ask about portfolio recommendations..."
      />
      <button onClick={sendPrompt} disabled={loading}>
        {loading ? "Thinking..." : "Ask Bedrock"}
      </button>
      {response && (
        <div style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
          <strong>AI Response:</strong> {response}
        </div>
      )}
    </div>
  );
}
