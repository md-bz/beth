import { Elysia } from "elysia";
import { html, Html } from "@elysiajs/html";

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

app.get("/", () =>
    baseHtml(
        <div class="box">
            <button
                hx-post="/clicked"
                hx-swap="outerHTML"
                class="has-text-primary"
            >
                click me
            </button>
        </div>
    )
);

app.post("/clicked", <div class="has-text-warning">im from server</div>);
app.get("/json", { response: "hello world" });

app.listen(5000);

console.log(`Running on http://127.0.0.1:5000`);
