import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import express from "express"
import { renderPage, createDevMiddleware } from "vike/server"
import { db } from "./db"
import { IncomingMessage } from "node:http"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const isProduction = process.env.NODE_ENV === "production"
const root = resolve(__dirname, "..")

startServer()

async function startServer() {
  const app = express()

  if (isProduction) {
    app.use(express.static(`${root}/dist/client`))
  } else {
    // Instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We should instantiate it *only* in development. (It isn't needed in production
    // and would unnecessarily bloat our server in production.)
    const { devMiddleware } = await createDevMiddleware({ root })
    app.use(devMiddleware)
  }

  app.post("/api/todos", async (req, res) => {
    const asIncomingMsg = req as IncomingMessage
    let data = ""
    for await (const chunk of asIncomingMsg) {
      data += chunk
    }
    try {
      const parsed = JSON.parse(data) as { text: string }
      if (!("text" in parsed) || typeof parsed.text !== "string")
        throw new Error("invalid payload")
      db.todos.add({ id: crypto.randomUUID(), text: parsed.text })
      console.log("added todo", db.todos)
    } catch (error) {
      res.status(400).end()
    }
    res.status(200).end()
  })

  /**
   * Vike route
   *
   * @link {@see https://vike.dev}
   **/
  app.all("*", async (req, res, next) => {
    const pageContextInit = { urlOriginal: req.originalUrl }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (httpResponse === null) return next()

    const { body, statusCode, headers, earlyHints } = httpResponse
    if (res.writeEarlyHints)
      res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
    res.status(statusCode)
    headers.forEach(([name, value]) => res.setHeader(name, value))
    res.send(body)
  })

  app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000, () => {
    console.log("Server listening on http://localhost:3000")
  })
}
