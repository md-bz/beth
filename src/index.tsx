import { t, Elysia } from "elysia";
import { html, Html } from "@elysiajs/html";
import { TodoList, TodoItem } from "./components/todo";
import { db } from "./db/index";
import { todos } from "./db/schema";
import { eq } from "drizzle-orm";

const app = new Elysia();
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

app.get("/todos", async () => {
    const data = await db.select().from(todos).all();
    return <TodoList todos={data} />;
});

app.post(
    "/todos",
    async ({ body }) => {
        const content = body.content;

        if (!content) return;
        const newTodo = await db.insert(todos).values(body).returning().get();
        return <TodoItem {...newTodo} />;
    },
    { body: t.Object({ content: t.String() }) }
);

app.post(
    "/todos/toggle/:id",
    async ({ params }) => {
        const oldTodo = await db
            .select()
            .from(todos)
            .where(eq(todos.id, params.id))
            .get();
        const newTodo = await db
            .update(todos)
            .set({ completed: !oldTodo?.completed })
            .where(eq(todos.id, params.id))
            .returning()
            .get();

        return <TodoItem {...newTodo} />;
    },
    { params: t.Object({ id: t.Numeric() }) }
);

app.delete(
    "/todos/:id",
    async ({ params }) => {
        await db.delete(todos).where(eq(todos.id, params.id)).run();

        return;
    },
    { params: t.Object({ id: t.Numeric() }) }
);

app.post("/clicked", <div class="has-text-warning">im from server</div>);
app.get("/json", { response: "hello world" });

app.listen(5000);

console.log(`Running on http://127.0.0.1:5000`);
