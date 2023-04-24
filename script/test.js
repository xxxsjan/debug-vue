const path = require("path");
const execa = require("execa");
const execPath = path.resolve(process.cwd(), "..");

(async () => {
  const res = await execa("dir", [], {
    cwd: execPath,
  });
  //   console.log(stdout);
  console.log(res);
})();
