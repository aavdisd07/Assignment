# XML → JSON Converter

A simple REST API that converts XML files to JSON using a **custom parser** — no XML libraries required.

---

## Features
- Convert XML to JSON
- Handles nested elements and repeated tags
- Converts attributes to `_key` format
- Supports self-closing tags
- Decodes common XML entities (`&amp;`, `&lt;`, etc.)
- Ignores comments and XML declarations
- Preserves mixed content (text + children)

---

## API Endpoint

### `POST /api/xmlToJson`
- **Input**:
  - `multipart/form-data` with a file field named `file` (optional)
  - If no file uploaded, `./test.xml` is used
- **Output**:
  - JSON `{ message, data }` where `data` is the parsed XML
- **Side-effect**:
  - Saves `output.json` to the project root

---

## Setup & Usage

1. Install dependencies:
   ```bash
   npm install
2. Start the Server:
   ```bash
   npm start
   