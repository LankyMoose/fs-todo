export { data }

import { db } from "$/db"
import { PageContext } from "vike/types"

async function data(pageContext: PageContext) {
  return {
    todos: Array.from(db.todos),
  }
}
