import { dir2array } from "https://js.sabae.cc/dir2array.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const fns = (await dir2array("data/")).sort();
let iccid = null;
const list = [];
const write = async () => {
  await Deno.writeTextFile("data/" + iccid + "/all.csv", CSV.stringify(list));
};
for (const fn of fns) {
  const ss = fn.split("/");
  if (ss.length != 2) {
    continue;
  }
  if (ss[1].length != "2023-06-23.csv".length) {
    continue;
  }
  const day = ss[1].substring(0, 10);
  const iccid0 = ss[0];
  if (iccid != iccid0) {
    if (iccid) {
      await write();
      list.length = 0;
    }
    iccid = iccid0;
  }
  const dd = await CSV.fetchJSON("data/" + fn);
  for (const d of dd) {
    list.push({
      dt: day + "T" + d.t,
      n: d.n,
    });
  }
}
if (iccid) {
  await write();
}
