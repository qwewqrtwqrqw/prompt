import fs from "node:fs";
import http from "node:http";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "db.json");
const PORT = 3001;

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function getUserFromToken(db, authHeader) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const userId = Number(token.replace("token-", ""));
  return db.users.find((user) => user.id === userId) ?? null;
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const db = readDb();

  try {
    if (req.method === "POST" && url.pathname === "/auth/login") {
      const { email, password } = await parseBody(req);
      const user = db.users.find(
        (item) => item.email === email && item.password === password,
      );
      if (!user) {
        sendJson(res, 401, { message: "Неверный email или пароль" });
        return;
      }
      sendJson(res, 200, {
        user: publicUser(user),
        token: `token-${user.id}`,
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/auth/register") {
      const { name, email, password } = await parseBody(req);
      if (db.users.some((item) => item.email === email)) {
        sendJson(res, 400, { message: "Email уже зарегистрирован" });
        return;
      }
      const user = {
        id: Date.now(),
        name,
        email,
        password,
      };
      db.users.push(user);
      writeDb(db);
      sendJson(res, 201, {
        user: publicUser(user),
        token: `token-${user.id}`,
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/topics") {
      const topics = [...db.topics].sort((a, b) => a.order - b.order);
      sendJson(res, 200, topics);
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/topics/")) {
      const slug = url.pathname.split("/")[2];
      const topic = db.topics.find((item) => item.slug === slug);
      if (!topic) {
        sendJson(res, 404, { message: "Тема не найдена" });
        return;
      }
      sendJson(res, 200, topic);
      return;
    }

    if (req.method === "GET" && url.pathname === "/templates") {
      const publicOnly = url.searchParams.get("public") === "true";
      let templates = db.templates;
      if (publicOnly) {
        templates = templates.filter((item) => item.isPublic);
      }
      sendJson(res, 200, templates);
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/templates/")) {
      const id = Number(url.pathname.split("/")[2]);
      const template = db.templates.find((item) => item.id === id);
      if (!template) {
        sendJson(res, 404, { message: "Шаблон не найден" });
        return;
      }
      sendJson(res, 200, template);
      return;
    }

    if (req.method === "GET" && url.pathname === "/me/templates") {
      const user = getUserFromToken(db, req.headers.authorization);
      if (!user) {
        sendJson(res, 401, { message: "Требуется авторизация" });
        return;
      }
      const templates = db.templates.filter((item) => item.authorId === user.id);
      sendJson(res, 200, templates);
      return;
    }

    if (req.method === "POST" && url.pathname === "/templates") {
      const user = getUserFromToken(db, req.headers.authorization);
      if (!user) {
        sendJson(res, 401, { message: "Требуется авторизация" });
        return;
      }
      const body = await parseBody(req);
      const template = {
        id: Date.now(),
        title: body.title,
        description: body.description,
        content: body.content,
        category: body.category,
        isPublic: Boolean(body.isPublic),
        authorId: user.id,
        authorName: user.name,
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      db.templates.push(template);
      writeDb(db);
      sendJson(res, 201, template);
      return;
    }

    if (req.method === "PUT" && url.pathname.startsWith("/templates/")) {
      const user = getUserFromToken(db, req.headers.authorization);
      if (!user) {
        sendJson(res, 401, { message: "Требуется авторизация" });
        return;
      }
      const id = Number(url.pathname.split("/")[2]);
      const index = db.templates.findIndex((item) => item.id === id);
      if (index === -1) {
        sendJson(res, 404, { message: "Шаблон не найден" });
        return;
      }
      if (db.templates[index].authorId !== user.id) {
        sendJson(res, 403, { message: "Нет доступа" });
        return;
      }
      const body = await parseBody(req);
      db.templates[index] = {
        ...db.templates[index],
        ...body,
        id,
        authorId: user.id,
        authorName: user.name,
      };
      writeDb(db);
      sendJson(res, 200, db.templates[index]);
      return;
    }

    if (req.method === "DELETE" && url.pathname.startsWith("/templates/")) {
      const user = getUserFromToken(db, req.headers.authorization);
      if (!user) {
        sendJson(res, 401, { message: "Требуется авторизация" });
        return;
      }
      const id = Number(url.pathname.split("/")[2]);
      const index = db.templates.findIndex((item) => item.id === id);
      if (index === -1) {
        sendJson(res, 404, { message: "Шаблон не найден" });
        return;
      }
      if (db.templates[index].authorId !== user.id) {
        sendJson(res, 403, { message: "Нет доступа" });
        return;
      }
      const [removed] = db.templates.splice(index, 1);
      writeDb(db);
      sendJson(res, 200, removed);
      return;
    }

    if (req.method === "POST" && url.pathname.endsWith("/like")) {
      const id = Number(url.pathname.split("/")[2]);
      const index = db.templates.findIndex((item) => item.id === id);
      if (index === -1) {
        sendJson(res, 404, { message: "Шаблон не найден" });
        return;
      }
      db.templates[index].likes += 1;
      writeDb(db);
      sendJson(res, 200, db.templates[index]);
      return;
    }

    sendJson(res, 404, { message: "Маршрут не найден" });
  } catch (error) {
    sendJson(res, 500, { message: error.message ?? "Ошибка сервера" });
  }
});

server.listen(PORT, () => {
  console.log(`Mock API: http://localhost:${PORT}`);
});
