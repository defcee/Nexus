import bcrypt from "bcrypt";

async function run() {
  const hash = await bcrypt.hash("admin123", 10);
  console.log("HASH:", hash);
}

run();