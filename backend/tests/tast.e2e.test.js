import "dotenv/config";
import request from "supertest";
import mongoose from "mongoose";
import express from "express";
import routes from "../src/tasks/routes/task.routes.js";

const app = express();
app.use(express.json());
app.use("/tasks", routes);

// Configurar la conexión a la base de datos de prueba
beforeAll(async () => {
 await mongoose.connect(`${process.env.MONGO_URI_TEST}/${process.env.DATABASE_NAME_TEST}`);
});

// Cerrar la conexión a la base de datos después de todas las pruebas
afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Test de tareas", () => {
    let taskId;
  test("Crear una tarea", async () => {
    const task = {
      title: "Tarea de prueba",
      description: "Descripción de la tarea de prueba",
      status: "pendiente",
    };
    const res = await request(app).post("/tasks").send(task);
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe(task.title);
    expect(res.body.data.description).toBe(task.description);
    expect(res.body.data.status).toBe(task.status);
    taskId = res.body.data._id;
  });

// Test para obtener todas las tareas
  test("Obtener todas las tareas", async () => {
    const res = await request(app).get("/tasks");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });


  // Test para obtener una tarea por su ID
  test("Obtener una tarea por su ID", async () => {
    const res = await request(app).get(`/tasks/${taskId}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(taskId);
  });


  // Test para actualizar una tarea
  test("Actualizar una tarea", async () => {
    const updatedTask = {
      title: "Tarea de prueba actualizada",
      description: "Descripción de la tarea de prueba actualizada",
      status: "pendiente",
    };
    const res = await request(app).put(`/tasks/${taskId}`).send(updatedTask);
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe(updatedTask.title);
    expect(res.body.data.description).toBe(updatedTask.description);
    expect(res.body.data.status).toBe(updatedTask.status);
  });

  // Test para eliminar una tarea
  test("Eliminar una tarea", async () => {
    const res = await request(app).delete(`/tasks/${taskId}`);
    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("Tarea eliminada correctamente");
  });

// Test para obtener una tarea por status
  test("Obtener tareas por status", async () => {
    const task = {
      title: "Tarea de prueba",
      description: "Descripción de la tarea de prueba",
      status: "pendiente",
    };
    await request(app).post("/tasks").send(task);
    const res = await request(app).get(`/tasks/status/${task.status}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // Test para obtener una tarea por title
  test("Obtener tareas por title", async () => {
    const task = {
      title: "Tarea de prueba",
      description: "Descripción de la tarea de prueba",
      status: "pendiente",
    };
    await request(app).post("/tasks").send(task);
    const res = await request(app).get(`/tasks/title/${task.title}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });


  // Test para obtener una tarea por description
  test("Obtener tareas por description", async () => {
    const task = {
      title: "Tarea de prueba",
      description: "Descripción de la tarea de prueba",
      status: "pendiente",
    };
    await request(app).post("/tasks").send(task);
    const res = await request(app).get(`/tasks/description/${task.description}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // Test para obtener una tarea por creationDate
  test("Obtener tareas por creationDate", async () => {
    const task = {
      title: "Tarea de prueba",
      description: "Descripción de la tarea de prueba",
      status: "pendiente",
    };
    const createRes = await request(app).post("/tasks").send(task);
    const creationDate = createRes.body.data.createdAt;
    const res = await request(app).get(`/tasks/creationDate/${encodeURIComponent(creationDate)}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // Test para obtener una tarea por updateDate
  test("Obtener tareas por updateDate", async () => {
    const task = {
      title: "Tarea de prueba",
      description: "Descripción de la tarea de prueba",
      status: "pendiente",
    };
    const createRes = await request(app).post("/tasks").send(task);
    const updateDate = createRes.body.data.updatedAt;
    const res = await request(app).get(`/tasks/updateDate/${encodeURIComponent(updateDate)}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  })
});
