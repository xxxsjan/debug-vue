const fg = require("fast-glob");
const path = require("path");
const fs = require("fs");

const cwd = process.cwd();

function getMdFiles() {
  return fg.sync("**.md", {
    onlyFiles: true,
    cwd,
    deep: 1,
    ignore: ["index.md", "template.md"],
  });
}

const mdList = getMdFiles();
const reg = /<!--  -->/g;
const output = path.resolve(__dirname, "../README.md");

const readmeContent = fs.readFileSync(path.join(__dirname, "./template.md"), {
  encoding: "utf-8",
});

const replaceContent = mdList
  .map((item) => {
    return `[${path.basename(item)}](./docs/${item})`;
  })
  .join("\n");
fs.writeFileSync(output, readmeContent.replace(reg, replaceContent), {
  encoding: "utf-8",
});
process.exit();
