import { CSV } from "https://js.sabae.cc/CSV.js";
import { DateTime, Day, TimeZone } from "https://js.sabae.cc/DateTime.js";
import { ArrayUtil } from "https://js.sabae.cc/ArrayUtil.js";

export const backupData = async (code, allflg = false) => {
  const savedate = allflg ? null : new DateTime().toLocal(TimeZone.JST).day.dayBefore(1);
  if (!allflg) {
    console.log("savedate", new DateTime().toLocal(TimeZone.JST).day.dayBefore(1))
  }
  const url = "http://mixsoda.io:2048/" + code + ".csv?from=" + (7 * 24 * 60 * 60);
  const data0 = await CSV.fetchJSON(url);
  const data = data0.map(d => {
    const dt0 = new DateTime(d.utc * 1000);
    const dt = dt0.toLocal(TimeZone.JST).toString(); //.substring(0, 19).replace("T", " ");
    //d.dt = dt.toString().substring(0, 10).replace("T", " ");
    const data = d.data.length <= 8 ? parseInt(d.data, 16) : d.data;
    const iccid = d.iccid;
    return { dt, data, iccid };
  });

  const dates = ArrayUtil.toUnique(data.map(d => d.dt.substring(0, "2023-06-19".length)));
  await Deno.mkdir("data", { recursive: true });
  for (const date of dates) {
    if (savedate && date != savedate) {
      continue;
    }
    const datad = data.filter(d => d.dt.startsWith(date)).map(d => ({ t: d.dt.substring("2023-06-19T".length, "2023-06-19T00:00:00".length), n: d.data, iccid: d.iccid }));
    const iccids = ArrayUtil.toUnique(data.map(d => d.iccid));
    for (const iccid of iccids) {
      await Deno.mkdir("data/" + iccid, { recursive: true });
      const datad2 = datad.filter(d => d.iccid == iccid).map(d => ({ t: d.t, n: d.n }));
      const fn = "data/" + iccid + "/" + date + ".csv";
      await Deno.writeTextFile(fn, CSV.stringify(datad2));
    }
  }
};
