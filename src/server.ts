import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { renderPage } from "vike/server"
import { serveStatic } from "@hono/node-server/serve-static"
import { compress } from "hono/compress"
import { HTTPException } from "hono/http-exception"

import { db } from "./db"

const isProduction = process.env.NODE_ENV === "production"
const port = Number(process.env.PORT) || 3000

const app = new Hono()
app.use(compress())
console.log("init new hono app")

if (isProduction) {
  console.log("is prod, serving static")
  app.use(
    "/*",
    serveStatic({
      root: `./dist/client/`,
    })
  )
}

const isString = (value: unknown): value is string => {
  return typeof value === "string"
}

app.post("/api/todos", async (c) => {
  console.log(`app.post("/api/todos")`)
  const body = await c.req.parseBody()
  const text = body.text
  if (!isString(text)) {
    throw new HTTPException(400, { message: "invalid payload" })
  }
  db.todos.add({ id: crypto.randomUUID(), text })

  c.status(201)

  return c.text("ligma")
})

app.get("*", async (c, next) => {
  const pageContextInit = {
    urlOriginal: c.req.url,
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) {
    return next()
  } else {
    const { body, statusCode, headers } = httpResponse
    headers.forEach(([name, value]) => c.header(name, value))
    c.status(statusCode)

    return c.body(body)
  }
})

if (isProduction) {
  console.log(`Server listening on http://localhost:${port}`)
  serve({
    fetch: app.fetch,
    port: port,
  })
}

export default app
