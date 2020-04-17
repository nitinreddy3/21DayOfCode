import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

app.listen({ port: 5000 });
console.log("App is listening at port 5000...");
