# XML → JSON Converter

## Project Overview
This project provides a custom XML → JSON converter exposed as a REST API.  
It does **not use any XML parsing libraries**. The parser handles:

- XML declarations (`<?xml ...?>`)
- Comments (`<!-- ... -->`)
- Nested elements with hierarchy
- Attributes (`id="001"` → `_id: "001"`)
- Self-closing tags (`<element/>`)
- Text content
- Entity references (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&apos;`)
- Mixed content and repeated elements (converted to arrays)

The project also includes a **minimal frontend** to test the API.

---

## Live Deployment
- API & Frontend URL: `https://<your-deployed-url>.onrender.com/`  
*(replace `<your-deployed-url>` with your actual Render URL)*

---

## Local Setup

1. Clone the repository and run:

```bash
git clone https://github.com/aavdisd07/Assignment.git
cd Assignment
npm install
node server.js
