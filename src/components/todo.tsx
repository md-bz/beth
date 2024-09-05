import { Html } from "@elysiajs/html";

export type Todo = {
    id: number;
    content: string;
    completed: boolean;
};

export function TodoItem({ content, completed, id }: Todo) {
    return (
        <div class="is-flex is-justify-content-space-between">
            <p>{content}</p>
            <input
                type="checkbox"
                checked={completed}
                hx-post={`/todos/toggle/${id}`}
                hx-target="closest div"
                hx-swap="outerHTML"
            />
            <button
                class="is-warning"
                hx-delete={`/todos/${id}`}
                hx-target="closest div"
                hx-swap="outerHTML"
            >
                X
            </button>
        </div>
    );
}

export function TodoList({ todos }: { todos: Todo[] }) {
    return (
        <div>
            <TodoForm />
            {todos.map((todo) => (
                <TodoItem {...todo} />
            ))}
        </div>
    );
}

export function TodoForm() {
    return (
        <form hx-post="/todos" hx-swap="afterend">
            <input type="text" name="content" />
            <button type="submit">Add</button>
        </form>
    );
}
