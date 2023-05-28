// git diff --name-only 未暂存
// git diff --name-only --cached  暂存区
// git diff --name-status --cached命令来获取暂存区中修改过和新增的文件列表
const path = require("path");
const execa = require("execa");
const execPath = path.resolve(process.cwd(), "..");

(async () => {
  const res = await execa("git", ["diff", "--name-status", "--cached"], {
    cwd: execPath,
  });
  if (res.stdout) {
    const log = res.stdout.split("\n").map((item) => {
      const _data = item.split("\t");
      return {
        type: _data[0],
        raw: item,
        basename: path.basename(_data[1]),
      };
    });
    const addFiles = log.filter((f) => f.type === "A");
    const updateFiles = log.filter((f) => f.type === "M");

    const commit = `${
      addFiles.length ? "add: " + addFiles.map((m) => m.basename).join(" ") : ""
    }
${
  updateFiles.length
    ? "update: " + updateFiles.map((m) => m.basename).join(" ")
    : ""
}`;
    console.log(commit);
  }
})();
