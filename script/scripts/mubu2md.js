const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const htmlPath = path.resolve(__dirname, "./vue2-api时间线.html");
const html = fs.readFileSync(htmlPath, "utf-8");
const dom = new JSDOM(html);

const document = dom.window.document;

function mubu2md() {
  const nodeList = document.querySelector("body>ul");

  function nodeToList(nodeList) {
    const nodes = [...nodeList.childNodes];
    const domNode = nodes.filter((n) => {
      // 过滤文本节点
      return n.nodeType !== 3;
    });

    return domNode.map((node) => {
      const childNodes = [...node.childNodes];
      const content = childNodes.filter(
        (f) => f.className === "content mm-editor"
      );

      const text = content[0].innerText || content[0].textContent;

      const children = childNodes.filter((f) => f.className === "children");
      let childNodeList;
      if (children.length > 0) {
        childNodeList = [...children[0].childNodes].filter(
          (f) => f.className === "node-list"
        )[0];
      }
      return {
        text: text.trim(),
        children: children.length > 0 ? nodeToList(childNodeList) : [],
      };
    });
  }

  function gen(num) {
    const prefix = `- `;
    const spaceText = `  `;
    return spaceText.repeat(num) + prefix;
  }

  function toMd(list, deep = 2) {
    const res = list.map((l, i) => {
      const _title =
        deep === 2
          ? "## " + l.text + "\n\n"
          : `${gen(deep - 3)}${l.text}` + "\n";
      const children = toMd(l.children, deep + 1);
      return _title + children;
    });

    if (deep === 2) {
      return res.join("\n");
    }
    return res.join("");
  }
  const list = nodeToList(nodeList);
  const res = toMd(list);
  return `# vue-api-时间线

<https://mubu.com/app>

${res}
`;
}
const output = path.resolve(__dirname, "../../docs/vue2-api时间线.md");
fs.writeFileSync(output, mubu2md(), "utf-8");
console.log("update:vue2-api时间线.md");
