const express = require("express");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

const FILE_PATH = "data.xlsx";

app.post("/submit", (req, res) => {
    let data = [];

    if (fs.existsSync(FILE_PATH)) {
        const workbook = XLSX.readFile(FILE_PATH);
        const sheet = workbook.Sheets["Sheet1"];
        data = XLSX.utils.sheet_to_json(sheet);
    }

    data.push(req.body);

    const newSheet = XLSX.utils.json_to_sheet(data);
    const newBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newBook, newSheet, "Sheet1");

    XLSX.writeFile(newBook, FILE_PATH);

    res.json({ message: "Saved successfully" });
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/result", (req, res) => {
    res.sendFile(path.join(__dirname, "result.html"));
});

app.get("/export", (req, res) => {
    res.download(FILE_PATH);
});

app.get("/api/data", (req, res) => {
    let data = [];
    if (fs.existsSync(FILE_PATH)) {
        const workbook = XLSX.readFile(FILE_PATH);
        const sheet = workbook.Sheets["Sheet1"];
        data = XLSX.utils.sheet_to_json(sheet);
    }
    res.json(data);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));