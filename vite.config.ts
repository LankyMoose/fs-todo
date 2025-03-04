import path from "node:path"
import { defineConfig } from "vite"
import vike from "vike/plugin"
import kaioken from "vite-plugin-kaioken"
import devServer from "@hono/vite-dev-server"

export default defineConfig({
  resolve: {
    alias: {
      $: path.join(__dirname, "src"),
    },
  },
  plugins: [
    vike(),
    kaioken(),
    devServer({
      entry: "./src/server.ts",
      exclude: [
        /^\/@.+$/,
        /.*\.(ts|tsx|vue)($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /^\/favicon\.ico$/,
        /.*\.(svg|png)($|\?)/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/,
      ],
      injectClientScript: false,
    }),
  ],
})
