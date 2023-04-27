const path = require("path");
const execa = require("execa");
const execPath = path.resolve(process.cwd(), "..");

(async () => {
  const res = await execa("git", ["status"], {
    cwd: execPath,
  });
  console.log(res);
})();
