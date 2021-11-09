require("dotenv").config();
const mongoose = require("mongoose");
const supertest = require("supertest");
const chalk = require("chalk");
const debug = require("debug")("robots:test");
const { connectDB } = require("../../database/index");
const Robot = require("../../database/models/robots");
const { app, initializeServer } = require("..");

const request = supertest(app);

let server;
let token;

beforeEach(async () => {
  debug(chalk.green("Inside beforeEach"));
  await connectDB(process.env.MONGO_DBSTRING_TEST);
  server = await initializeServer(5002);
  const { body } = await request
    .post("/user/login")
    .send({ username: "nunu", password: "1234password" })
    .expect(200);
  token = body.token;
  await Robot.deleteMany({});
  await Robot.create({
    id: "12345",
    features: {
      speed: 7,
      stamina: 3,
      creationDate: 2700,
    },
    name: "Eva",
    url: "https://www.desktopbackground.org/download/1920x1080/2013/10/22/658116_download-wall-e-and-eve-wallpapers-wide_3497x1463_h.jpg",
  });

  await Robot.create({
    id: "1234567",
    features: {
      speed: 10,
      stamina: 4,
      creationDate: 2500,
    },
    name: "Wall-e",
    url: "https://www.desktopbackground.org/download/1920x1080/2013/10/22/658116_download-wall-e-and-eve-wallpapers-wide_3497x1463_h.jpg",
  });
});

afterAll(async () => {
  await mongoose.connection.close;
  await server.close;
});

describe("Given a /robots router", () => {
  describe("When a GET request arrives to / ", () => {
    test("Then it should respond with an array of robots and status 200", async () => {
      const { body } = await request
        .get("/robots")
        .send("Authorization", `Bearer ${token.token}`)
        .expect(201);

      expect(body).toHaveLength(2);
      expect(body).toContainEqual({
        id: "12345",
        features: {
          speed: 7,
          stamina: 3,
          creationDate: 2700,
        },
        name: "Eva",
        url: "https://www.desktopbackground.org/download/1920x1080/2013/10/22/658116_download-wall-e-and-eve-wallpapers-wide_3497x1463_h.jpg",
      });
      expect(body).toContainEqual({
        id: "1234567",
        features: {
          speed: 10,
          stamina: 4,
          creationDate: 2500,
        },
        name: "Wall-e",
        url: "https://www.desktopbackground.org/download/1920x1080/2013/10/22/658116_download-wall-e-and-eve-wallpapers-wide_3497x1463_h.jpg",
      });
    });
  });

  describe("When a GET request arrives to /robots/:idRobot with a correct id ", () => {
    test("Then it should respond with a robot and a status 200", async () => {
      const { body } = await request
        .get("/robots/12345")
        .send("Authorization", `Bearer ${token}`)
        .expect(201);

      expect(body).toHaveProperty("name", "Eva");
      expect(body).toHaveProperty(
        "url",
        "https://www.desktopbackground.org/download/1920x1080/2013/10/22/658116_download-wall-e-and-eve-wallpapers-wide_3497x1463_h.jpg"
      );
    });
  });
  describe("When a GET request arrives to /robots/:idRobot with an incorrect id", () => {
    test("Then it should respond with a status 404", async () => {
      const { body } = await request
        .get("/robots/32456")
        .send("Authorization", `Bearer ${token}`)
        .expect(404);

      const expectedError = {
        message: "Robot not found :(",
      };

      expect(body).toEqual(expectedError);
    });
  });
  describe("When a DELETE method arrives to /robots/delete/:idRobot with an id", () => {
    test("Then it should respond with a robot deleted and status 202", async () => {
      const { body } = await request
        .get("/robots/delete/12345")
        .send("Authorization", `Bearer ${token}`)
        .expect(202);

      expect(body).not.toHaveProperty("name", "Eva");
    });
  });
  describe("When a DELETE method arrives to /robots/delete/:idRobot with an incorrect id", () => {
    test("Then it should respond with a status 404 Not Found", async () => {
      const { body } = await request
        .get("/robots/delete/1245345")
        .send("Authorization", `Bearer ${token}`)
        .expect(404);

      const expectedError = {
        message: "Robot to delete not found :(",
      };

      expect(body).toEqual(expectedError);
    });
  });
});
