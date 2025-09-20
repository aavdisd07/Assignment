
---

### **APPROACH.md**

```markdown
# Approach for XML → JSON Converter

## Goal
To create a robust XML → JSON converter **without using any XML parsing libraries**, and expose it via a REST API.

---

## Key Design Decisions
1. **No external libraries:** The parser scans the XML string manually.
2. **Attributes:** Converted to object keys with `_` prefix (e.g., `id="001"` → `_id: "001"`).
3. **Repeated elements:** Multiple siblings with same tag are stored as arrays.
4. **Text nodes:**
   - If element contains only text → stored as string
   - If element has attributes or children → text stored under `#text` key
5. **Entity decoding:** Handles standard XML entities (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&apos;`).
6. **Comments & XML declarations:** Skipped/ignored.
7. **Self-closing tags:** Treated as empty elements with attributes.

---

## Parser Flow
1. Skip XML declarations (`<?...?>`) and comments (`<!-- ... -->`).
2. Iterate through XML string character by character.
3. On `<`:
   - If closing tag `</name>` → pop node from stack, attach to parent
   - If opening tag `<name ...>` or self-closing `<name .../>` → create node
4. Text between tags → stored as text nodes
5. Build the final JSON object by walking the parsed node tree
6. Collapse nodes with only `#text` into strings

---

## Frontend
- Minimal HTML + JS interface to upload XML files
- Sends file via `POST /api/xmlToJson`
- Displays JSON response on page
- Optional: falls back to `test.xml` if no file uploaded

---

## Limitations & Future Improvements
- Currently handles UTF-8 XML files with standard entities
- Does **not support CDATA, namespaces, or DTDs**
- Could be extended for:
  - Streaming parsing for very large files
  - CDATA & namespace handling
  - Better error reporting

---

## Deployment
- Project can be deployed on platforms like **Render**, **Railway**, **Heroku**, etc.
- Public URL exposes both the API and frontend for testing.
