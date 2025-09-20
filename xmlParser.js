// Replace XML entities like &amp; → &
function decode(str) {
  if (!str) return str;
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

// Turn attribute string into an object { _key: value }
function readAttributes(attrStr) {
  const attrs = {};
  if (!attrStr) return attrs;

  const regex = /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match;

  while ((match = regex.exec(attrStr))) {
    const key = match[1];
    const val = match[2] ?? match[3] ?? match[4] ?? "";
    attrs["_" + key] = decode(val);
  }

  return attrs;
}

// Convert node structure into plain object
function buildObject(node) {
  const obj = { ...node.attributes };

  for (const child of node.children) {
    if (child.type === "text") {
      const text = decode(child.text).trim();
      if (!text) continue;

      if (
        Object.keys(obj).length > 0 ||
        node.children.some((c) => c.type === "element")
      ) {
        obj["#text"] = obj["#text"] ? obj["#text"] + " " + text : text;
      } else {
        obj["#text"] = text;
      }
    } else if (child.type === "element") {
      const childObj = buildObject(child);
      const key = child.name;

      let value;
      const keys = Object.keys(childObj);
      value = keys.length === 1 && keys[0] === "#text" ? childObj["#text"] : childObj;

      if (obj[key]) {
        if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
        obj[key].push(value);
      } else {
        obj[key] = value;
      }
    }
  }

  return obj;
}

// Main parser function
function parse(xml) {
  if (!xml || typeof xml !== "string") {
    throw new Error("Invalid XML input");
  }

  xml = xml.trim();
  let i = 0;
  const n = xml.length;
  const stack = [];
  let current = { name: null, attributes: {}, children: [] };

  function peek(s) {
    return xml.substr(i, s.length) === s;
  }

  while (i < n) {
    if (peek("<?")) {
      const end = xml.indexOf("?>", i + 2);
      if (end === -1) throw new Error("Bad XML declaration");
      i = end + 2;
      continue;
    }

    if (peek("<!--")) {
      const end = xml.indexOf("-->", i + 4);
      if (end === -1) throw new Error("Unclosed comment");
      i = end + 3;
      continue;
    }

    if (xml[i] === "<") {
      if (peek("</")) {
        const end = xml.indexOf(">", i + 2);
        if (end === -1) throw new Error("Bad closing tag");
        const finished = stack.pop();

        if (stack.length === 0) {
          current = finished;
        } else {
          stack[stack.length - 1].children.push({
            type: "element",
            name: finished.name,
            attributes: finished.attributes,
            children: finished.children,
          });
        }

        i = end + 1;
      } else {
        const end = xml.indexOf(">", i + 1);
        if (end === -1) throw new Error("Unclosed tag");

        const tagBody = xml.substring(i + 1, end).trim();
        const isSelfClose = tagBody.endsWith("/");
        const content = isSelfClose ? tagBody.slice(0, -1).trim() : tagBody;

        const spaceIdx = content.search(/\s/);
        const tagName = spaceIdx === -1 ? content : content.substring(0, spaceIdx);
        const attrStr = spaceIdx === -1 ? "" : content.substring(spaceIdx + 1);

        const node = { name: tagName, attributes: readAttributes(attrStr), children: [] };

        if (isSelfClose) {
          if (stack.length === 0) {
            current = node;
          } else {
            stack[stack.length - 1].children.push({
              type: "element",
              name: node.name,
              attributes: node.attributes,
              children: node.children,
            });
          }
        } else {
          stack.push(node);
        }

        i = end + 1;
      }
    } else {
      const nextTag = xml.indexOf("<", i);
      const textEnd = nextTag === -1 ? n : nextTag;
      const text = xml.substring(i, textEnd);

      if (stack.length === 0) {
        if (text.trim()) {
          if (!current || current.name === null) {
            current = {
              name: "_document",
              attributes: {},
              children: [{ type: "text", text }],
            };
          } else {
            current.children.push({ type: "text", text });
          }
        }
      } else {
        stack[stack.length - 1].children.push({ type: "text", text });
      }

      i = textEnd;
    }
  }

  let doc;
  if (stack.length === 1) {
    const root = stack[0];
    doc = { [root.name]: buildObject(root) };
  } else if (stack.length === 0 && current && current.name) {
    doc = { [current.name]: buildObject(current) };
  } else {
    throw new Error("Invalid XML structure");
  }

  // Simplify {"#text": "value"} → "value"
  function collapse(obj) {
    if (Array.isArray(obj)) return obj.map(collapse);
    if (obj && typeof obj === "object") {
      const keys = Object.keys(obj);
      for (const k of keys) obj[k] = collapse(obj[k]);
      if (keys.length === 1 && keys[0] === "#text") return obj["#text"];
    }
    return obj;
  }

  return collapse(doc);
}

module.exports = { parse };
