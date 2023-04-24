const fg = require("fast-glob");
const path = require("path");
const fs = require("fs");

const execa = require("execa");
const execPath = path.resolve(process.cwd(), "..");

const cwd = process.cwd();
const docsPath = path.resolve(__dirname, "../docs");
const reg = /<!--  -->/g;
const output = path.resolve(__dirname, "../README.md");

function getMdFiles() {
  return fg.sync("**.md", {
    onlyFiles: true,
    cwd: docsPath,
    deep: 1,
    ignore: ["index.md", "template.md"],
  });
}

const readmeContent = fs.readFileSync(path.join(__dirname, "./template.md"), {
  encoding: "utf-8",
});
const mdList = getMdFiles();

// console.log(mdList.sort());
// console.log('mdList: ', mdList);
// process.exit();

const replaceContent = mdList
  .map((item) => {
    return `[${item.split(".")[0]}](./docs/${item})`;
  })
  .join("\n\n");

fs.writeFile(
  output,
  readmeContent.replace(reg, replaceContent),
  {
    encoding: "utf-8",
  },
  function (err) {
    if (!err) {
      console.log("update:README.md  ", output);
      runCommands();
    }
  }
);
async function runCommands() {
  const opt = { cwd: execPath };
  console.log("command run at ", execPath);
  const res = await execa("git", ["status"], opt);
  if (res.stdout.indexOf("README.md") > -1) {
    console.log("success run: git status");
    const res2 = await execa("git", ["add", "README.md"], opt);
    console.log("success run: git add README.md");

    const res3 = await execa(
      "git",
      ["commit", "-m", '"update:README.md"'],
      opt
    );
    console.log("success run: git commit");
  }
}
