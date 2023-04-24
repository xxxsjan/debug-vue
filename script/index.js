const fg = require("fast-glob");
const path = require("path");
const fs = require("fs");

const { exec, execSync } = require("child_process");
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
function runCommands() {
  const opt = { cwd: execPath };
  try {
    const stdout = execSync("git status", opt);
    if (`${stdout}`.indexOf("README.md") > -1) {
      try {
        const stdout = execSync("git add README.md", opt);
        console.log(`stdout of command1: ${stdout}`);
        const stdout2 = execSync('git commit -m "update:README.md"', opt);
        console.log(`stdout of command1: ${stdout2}`);
      } catch (error) {}
    }
  } catch (error) {}
}
