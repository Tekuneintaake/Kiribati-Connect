export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    // Initialize tables (safe to run multiple times)
    if (pathname === "/init") {
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY,
          name TEXT,
          email TEXT UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run();

      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY,
          title TEXT,
          content TEXT,
          author_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author_id) REFERENCES users(id)
        )
      `).run();

      return new Response("✅ Tables initialized");
    }

    // GET /users
    if (pathname === "/users") {
      const { results } = await env.DB.prepare("SELECT * FROM users").all();
      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // POST /users
    if (pathname === "/users" && request.method === "POST") {
      const body = await request.json();
      const { name, email } = body;

      const result = await env.DB.prepare(
        "INSERT INTO users (name, email) VALUES (?, ?)"
      ).bind(name, email).run();

      return new Response(`✅ User added`);
    }

    // GET /posts
    if (pathname === "/posts") {
      const { results } = await env.DB.prepare("SELECT * FROM posts").all();
      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // POST /posts
    if (pathname === "/posts" && request.method === "POST") {
      const body = await request.json();
      const { title, content, author_id } = body;

      const result = await env.DB.prepare(
        "INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)"
      ).bind(title, content, author_id).run();

      return new Response(`✅ Post added`);
    }

    // Homepage
    return new Response("Kiribati-Connect API is live!");
  },
};
