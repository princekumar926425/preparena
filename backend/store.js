import fs from "fs";
import path from "path";

const dataFile = path.resolve("backend", "data.json");

function loadStore() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ users: [], contests: [], lectures: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function saveStore(store) {
  fs.writeFileSync(dataFile, JSON.stringify(store, null, 2));
}

export { loadStore, saveStore };