const fs = require("fs");
const path = require("path");
async function saveScreenshot(page, name) {
  const dir = path.resolve("screenshots");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${name}-${Date.now()}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}
module.exports = { saveScreenshot };
