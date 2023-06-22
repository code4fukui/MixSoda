import { backupData } from "./backupData.js";

const code = Deno.args[0];
const allflg = Deno.args[1] == "all";
if (!code) {
  console.log("deno run -A backupDataByDate.js [code] (all)");
  Deno.exit(1);
}
await backupData(code, allflg);
