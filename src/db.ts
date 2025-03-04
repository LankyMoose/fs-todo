export type Todo = {
  id: string
  text: string
}

type Db = {
  todos: Set<Todo>
}

declare global {
  var __db: Db
}

const getDbInstance = () => {
  return (globalThis.__db ??= {
    todos: new Set(),
  })
}

export const db = getDbInstance()
