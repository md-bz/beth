import { t, Elysia } from "elysia";
import { html, Html } from "@elysiajs/html";
import { TodoList, type Todo, TodoItem } from "./components/todo";

const app = new Elysia();

let db: Todo[] = [
    {
        id: 1,
        content: "learn jsx",
        completed: false,
    },
    {
        id: 2,
        content: "learn js",
        completed: true,
    },
];

const baseHtml = (body: JSX.Element) => (
    <html lang="en">
        <head>
            <title>Hello World</title>
            <script src="https://unpkg.com/htmx.org@2.0.2"></script>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css"
            ></link>
        </head>
        <body class="container is-mobile is-flex is-justify-content-center is-align-content-center mt-5">
            {body}
        </body>
    </html>
);

app.use(html());

app.get("/", () => baseHtml(<div hx-get="/todos" hx-trigger="load"></div>));

app.get("/todos", () => <TodoList todos={db} />);

app.post(
    "/todos",
    ({ body }) => {
        const content = body.content;

        if (!content) return;
        const newTodo = {
            id: Date.now(),
            content,
            completed: false,
        };
        db.push(newTodo);
        return <TodoItem {...newTodo} />;
    },
    { body: t.Object({ content: t.String() }) }
);

app.post(
    "/todos/toggle/:id",
    ({ params }) => {
        const todo = db.find((todo) => todo.id === params.id);
        if (todo) {
            todo.completed = !todo.completed;
            console.log(db);
            return <TodoItem {...todo} />;
        }
    },
    { params: t.Object({ id: t.Numeric() }) }
);

app.delete(
    "/todos/:id",
    ({ params }) => {
        db = db.filter((todo) => todo.id !== params.id);

        return;
    },
    { params: t.Object({ id: t.Numeric() }) }
);

app.post("/clicked", <div class="has-text-warning">im from server</div>);
app.get("/json", { response: "hello world" });

app.listen(5000);

console.log(`Running on http://127.0.0.1:5000`);
