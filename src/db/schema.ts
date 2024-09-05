// import { integer } from "drizzle-orm/pg-core";
import type { InferInsertModel } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    content: text("content").notNull(),
    completed: integer("completed", { mode: "boolean" })
        .notNull()
        .default(false),
});

export type Todo = InferInsertModel<typeof todos>;
