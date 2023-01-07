import { defineConfig } from "vite";

export default defineConfig({
	resolve: {
		alias: {
			"~PACKAGE_NAME~": "../src/index",
		},
	},
});
