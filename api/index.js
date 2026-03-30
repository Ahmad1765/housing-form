require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// SUPABASE CONFIGURATION - Using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL ERROR: SUPABASE_URL or SUPABASE_KEY is missing from environment variables!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(bodyParser.json());
// Middleware for static files - MUST come before catch-all routes
app.use(express.static(path.join(__dirname, "..", "public")));

// Route for root to ensure index.html serves correctly
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Vercel routes logic should prioritize static files in 'public/'
// but we leave Express routes for local testing consistency.


// SUBMIT ENDPOINT - Saves data to Supabase
app.post("/submit", async (req, res) => {
  try {
    const { error } = await supabase.from("submissions").insert([req.body]);
    if (error) throw error;
    res.json({ message: "Saved successfully to Supabase" });
  } catch (error) {
    console.error("Error inserting into Supabase:", error);
    res.status(500).json({ error: "Failed to save submission", details: error.message });
  }
});

// API ENDPOINT - Retrieves all data from Supabase
app.get("/api/data", async (req, res) => {
  try {
    const { data, error } = await supabase.from("submissions").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error("Error fetching from Supabase:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// EXPORT ENDPOINT - Generates XLSX in-memory to bypass Vercel's read-only filesystem
app.get("/export", async (req, res) => {
  try {
    const { data, error } = await supabase.from("submissions").select("*");
    if (error) throw error;

    // Generate sheet and book
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Static write to a BUFFER instead of a local file
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=\"data.xlsx\"");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (error) {
    console.error("Error during export:", error);
    res.status(500).send("Export failed");
  }
});

// Helper routes
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "..", "public", "admin.html")));
app.get("/result", (req, res) => res.sendFile(path.join(__dirname, "..", "public", "result.html")));

// CONDITIONAL STARTUP - Run listen only if not on Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Local server running on http://localhost:${PORT}`));
}

// Export app for Vercel's monolithic serverless handle
module.exports = app;