
---

## **APPROACH.md** (concise design & flow)

```markdown
# Approach

## Goal
Build a lightweight, custom XML → JSON parser with no external libraries, exposed via `POST /api/xmlToJson`.

---

## How it works
1. **Custom parser**: Reads XML character by character.
2. **Attributes**: Prefixed with `_` in JSON.
   ```xml
   <item id="001"> → { "_id": "001" }
