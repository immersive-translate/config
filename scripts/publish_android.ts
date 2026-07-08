import metaJson from "../dist/meta.json" with { type: "json" };

function parseArgs() {
  const args: Record<string, string> = {};
  for (const arg of Deno.args) {
    const separatorIndex = arg.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = arg.slice(0, separatorIndex);
    const value = arg.slice(separatorIndex + 1);
    if (key && value) {
      args[key] = value;
    }
  }
  return args;
}

const args = parseArgs();
const androidAppInfo = args.android_app_info;
const isCNSite = args.is_cn_site === "true";

async function main() {
  if (!isCNSite && !checkInfoIsValid(androidAppInfo)) {
    console.log(
      "need android app info like official-fenixRelease-xxx.apk or official-release-xxx.apk",
    );
    return;
  }
  await updateAppInfo(androidAppInfo, isCNSite);
}

if (import.meta.main) {
  main();
}

function checkInfoIsValid(info?: string) {
  if (!info) return false;
  const regex = /^official-(?:fenixRelease|release)-.+\.apk$/;
  return regex.test(info);
}

async function updateAppInfo(info?: string, isCNSite?: boolean) {
  if (!info) {
    console.error("No info provided");
    return;
  }

  if (isCNSite) {
    metaJson.cnAndroidAppInfo = info;
    console.log("Updated CN site configuration successfully");
    console.log(`CN Android app info: ${info}`);
  } else {
    metaJson.androidAppInfo = info;
    console.log("Updated global site configuration successfully");
    console.log(`Android app info: ${info}`);
  }

  const filePath = new URL("../dist/meta.json", import.meta.url);
  await Deno.writeTextFile(filePath, JSON.stringify(metaJson, null, 2));
}
