#!/usr/bin/env node

/**
 * @typedef {import('./types').Context} Context
 */

import fs from "node:fs";
import path from "node:path";
import { bold, cyan, gray, green } from "kleur/colors";

import { prompt } from "./prompt.js";
import { mkdirp } from "./utils.js";

const { version } = JSON.parse(
  fs.readFileSync(new URL("package.json", import.meta.url), "utf-8")
);

async function main() {
  console.log(gray(`\ncreate-pkg version ${version}`));

  const ctx = await prompt();

  mkdirp(ctx.cwd);

  const from = path.resolve(ctx.template);
  const to = path.resolve(ctx.cwd);

  walk(from, to, ctx);

  console.log(bold(green("\nYour project is ready!")));
  console.log("\nNext steps:");
  let i = 1;

  const relative = path.relative(process.cwd(), ctx.cwd);
  if (relative !== "") {
    console.log(`  ${i++}: ${bold(cyan(`cd ${relative}`))}`);
  }

  console.log(`  ${i++}: ${bold(cyan("npm install"))} (or pnpm install, etc)`);
  // prettier-ignore
  console.log(`  ${i++}: ${bold(cyan('git init && git add -A && git commit -m "Initial commit"'))} (optional)`);
}

main();

/**
 * @param {string} fromDir
 * @param {string} toDir
 * @param {Context} ctx
 */
function walk(fromDir, toDir, ctx) {
  const files = fs.readdirSync(fromDir);

  for (const file of files) {
    const from = path.resolve(fromDir, file);
    const to = path.resolve(toDir, file);
    const stats = fs.lstatSync(from);

    if (fs.existsSync(from) && stats.isFile()) {
      if (path.basename(from) === ".gitkeep") continue;

      let contents = fs.readFileSync(from, "utf-8");

      // Replace template variables
      if (ctx.scope) {
        const scoped = `${ctx.scope}/${ctx.basename}`;
        contents = contents.replace(/~UNSCOPED_PACKAGE_NAME~/g, ctx.basename);
        contents = contents.replace(/~PACKAGE_NAME~/g, scoped);
      } else {
        contents = contents.replace(/~(?:UNSCOPED_)?PACKAGE_NAME~/g, ctx.name);
      }
      if (ctx?.author?.name) {
        contents = contents.replace(/~AUTHOR_NAME~/g, ctx.author.name);
      }

      // Merge context settings with `package.json`
      if (ctx.root && file === "package.json") {
        const pkg = JSON.parse(contents);
        if (ctx.author) {
          pkg.author = {};
          for (const [key, value] of Object.entries(ctx.author)) {
            pkg.author[key] = value;
          }
        }
        contents = JSON.stringify(pkg);
      }

      fs.writeFileSync(to, contents);

      if (/#!\/bin\/bash/.test(contents)) {
        fs.chmodSync(to, "755");
      }
    } else if (stats.isDirectory()) {
      if (ctx.root) ctx.root = false;
      mkdirp(to);
      walk(from, to, ctx);
    }
  }
}
