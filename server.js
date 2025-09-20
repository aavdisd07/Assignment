const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { parse } = require("./xmlParser"); 

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;

// Serve frontend file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API endpoint
app.post("/api/xmlToJson", upload.single("file"), (req, res) => {
  try {
    let xmlContent;

    if (req.file && req.file.buffer) {
      xmlContent = req.file.buffer.toString("utf8");
    } else {
      const filePath = path.join(__dirname, "test.xml");
      if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: "No XML file uploaded and test.xml is missing." });
      }
      xmlContent = fs.readFileSync(filePath, "utf8");
    }

    const jsonResult = parse(xmlContent);

    fs.writeFileSync(path.join(__dirname, "output.json"), JSON.stringify(jsonResult, null, 2), "utf8");

    res.json({ message: "XML converted successfully", result: jsonResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
