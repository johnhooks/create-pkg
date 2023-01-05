import fs from 'node:fs';
import path from 'node:path';
import { mkdirp, copy, template } from './utils.js';

/** @type {import('./types/index').create} */
export async function create(cwd, options) {
	mkdirp(cwd);

	write_template_files(options.name, cwd);
}

/**
 * @param {string} name
 * @param {string} cwd
 */
function write_template_files(name, cwd) {
	const dir = template

}

/**
 * @param {string} dir
 * @param {string} cwd
 */
function walk(dir, cwd) {
	const files = fs.readdirSync(dir)
	for (const file in files) {
		const stats = fs.lstatSync(file)
		if (stats.isFile()) {
			const contents = fs.readFileSync(path.resolve(dir, file), "utf-8")
			mkdirp(cwd);
			fs.writeFileSync(cwd, contents.replace(/~TODO~/g, file));
		} else if (stats.isDirectory()) {
			walk(path.resolve(dir, file), path.resolve(cwd, file))
		}
	}
}
