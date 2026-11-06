import fs from "fs";
import readline from "readline";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "notes.json");

// Load / save
function load() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}
function save(notes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

// Display
function list(notes) {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  if (notes.length === 0) {
    console.log("  No notes yet.");
  } else {
    notes.forEach((n, i) => console.log(`  [${i + 1}] ${n}`));
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

function menu() {
  console.log("  Commands:  add | edit | delete | list | quit");
}

// Main
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

const notes = load();
console.log("\n📝  Terminal Notes");
list(notes);
menu();

async function run() {
  while (true) {
    const cmd = (await ask("\n> ")).trim().toLowerCase();

    if (cmd === "add" || cmd === "a") {
      const text = (await ask("  Note: ")).trim();
      if (text) {
        notes.push(text);
        save(notes);
        console.log("  ✔ Added.");
      }
    } else if (cmd === "edit" || cmd === "e") {
      list(notes);
      const idx = parseInt(await ask("  Note #: "), 10) - 1;
      if (idx >= 0 && idx < notes.length) {
        const text = (await ask(`  New text (was: "${notes[idx]}"): `)).trim();
        if (text) {
          notes[idx] = text;
          save(notes);
          console.log("  ✔ Updated.");
        }
      } else {
        console.log("  Invalid number.");
      }
    } else if (cmd === "delete" || cmd === "d") {
      list(notes);
      const idx = parseInt(await ask("  Note #: "), 10) - 1;
      if (idx >= 0 && idx < notes.length) {
        const removed = notes.splice(idx, 1);
        save(notes);
        console.log(`  ✔ Deleted: "${removed[0]}"`);
      } else {
        console.log("  Invalid number.");
      }
    } else if (cmd === "list" || cmd === "l") {
      list(notes);
    } else if (cmd === "quit" || cmd === "q") {
      console.log("  Bye! 👋\n");
      rl.close();
      break;
    } else {
      menu();
    }
  }
}

run();

