require("dotenv").config();
const mongoose = require("mongoose");
const supertest = require("supertest");
const chalk = require("chalk");
const debug = require("debug")("robots:test");
const { connectDB } = require("../../database/index");
const Robot = require("../../database/models/robots");
const { app, initializeServer } = require("..");

const request = supertest(app);

const fakeRobots = [
  {
    _id: "618b8479a71b26e71035482b",
    features: {
      speed: 7,
      stamina: 3,
      creationDate: 2700,
    },
    name: "Evita",
    url: "https://www.desktopbackground.org/download/1920x1080/2013/10/22/658116_download-wall-e-and-eve-wallpapers-wide_3497x1463_h.jpg",
  },
  {
    _id: "618b8479a71b26e71035482e",
    features: {
      speed: 10,
      stamina: 4,
      creationDate: 2500,
    },
    name: "Wall-e",
    url: "https://www.desktopbackground.org/download/1920x1080/2013/10/22/658116_download-wall-e-and-eve-wallpapers-wide_3497x1463_h.jpg",
  },
];

let server;
let token;

beforeAll(async () => {
  await connectDB(process.env.MONGO_DBSTRING_TEST);
  server = await initializeServer(process.env.SERVER_PORT_TEST);
  await Robot.deleteMany({});

  const { body } = await request
    .post("/user/login")
    .send({ username: "nunu", password: "1234password" })
    .expect(200);
  token = body.token;
});

beforeEach(async () => {
  debug(chalk.green("Inside beforeEach"));

  await Robot.create(fakeRobots[0]);
  await Robot.create(fakeRobots[1]);
});

afterAll(async (done) => {
  await server.close(async () => {
    await mongoose.connection.close();
    done();
  });
});

describe("Given a /robots router", () => {
  describe("When a GET request arrives with token ", () => {
    test("Then it should respond with an array of robots and status 200", async () => {
      const { body } = await request
        .get("/robots")
        .send("Authorization", `Bearer ${token}`)
        .expect(201);

      const fakeRobotsWithId = fakeRobots.map((fakeRobot) => {
        const fakeRobotWithId = {
          ...fakeRobot,
          id: fakeRobot._id,
        };
        delete fakeRobotWithId._id;
        return fakeRobotWithId;
      });

      expect(body).toHaveLength(fakeRobots.length);
      expect(body).toContainEqual(fakeRobotsWithId[0]);
      expect(body).toContainEqual(fakeRobotsWithId[1]);
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
        .delete("/robots/delete/12345")
        .send("Authorization", `Bearer ${token}`)
        .expect(202);

      expect(body).not.toHaveProperty("name", "Eva");
    });
  });
  describe("When a DELETE method arrives to /robots/delete/:idRobot with an incorrect id", () => {
    test("Then it should respond with a status 404 Not Found", async () => {
      const { body } = await request
        .delete("/robots/delete/1245345")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      const expectedError = {
        message: "Robot to delete not found :(",
      };

      expect(body).toEqual(expectedError);
    });
  });
});
