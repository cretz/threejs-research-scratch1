import { defineConfig } from "vite";
import { directoryPlugin } from "vite-plugin-list-directory-contents";

export default defineConfig({
  plugins: [directoryPlugin({ baseDir: __dirname })],
})