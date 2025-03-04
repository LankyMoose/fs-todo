import type { data } from "./+data"

export function Page({ todos }: Awaited<ReturnType<typeof data>>) {
  console.log(todos)
  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const text = formData.get("text")

    if (!text) return
    const res = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ text: text.toString() }),
    })

    if (res.ok) {
      window.location.reload()
    }
  }
  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>{todo.text}</div>
      ))}
      <form onsubmit={handleSubmit}>
        <input type="text" name="text" />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}
