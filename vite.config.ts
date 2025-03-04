import path from "node:path"
import { defineConfig } from "vite"
import vike from "vike/plugin"
import kaioken from "vite-plugin-kaioken"
import * as vcf from "vike-cloudflare"
import devServer from "@hono/vite-dev-server"

const { pages } = vcf as {
  pages: Function
}

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
    pages({
      server: {
        kind: "hono", // or "hattip"
        entry: "./src/server.ts", // entrypoint of the server
      },
    }),
  ],
})
