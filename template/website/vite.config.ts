import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";

export default defineConfig({
	resolve: {
		alias: {
			"~PACKAGE_NAME~": fileURLToPath(new URL("../src/index.ts", import.meta.url).href),
		},
	},
});
