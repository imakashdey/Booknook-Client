const { MongoClient } = require("mongodb");
const fs = require("fs");

const file = process.argv[2] || ".env.local";
const line = fs
  .readFileSync(file, "utf8")
  .split(/\r?\n/)
  .find((l) => l.startsWith("MONGODB_URI="));
const uri = line ? line.slice("MONGODB_URI=".length).trim() : "";

const user = uri.includes("//") ? uri.split("//")[1].split(":")[0] : "";
console.log("File:", file);
console.log("URI found:", Boolean(uri));
console.log("Username in URI:", user);
console.log("Has < or > or quotes:", /[<>"']/.test(uri));

new MongoClient(uri)
  .connect()
  .then(() => {
    console.log("RESULT: CONNECTED");
    process.exit(0);
  })
  .catch((e) => {
    console.log("RESULT: FAILED -", e.message);
    process.exit(1);
  });