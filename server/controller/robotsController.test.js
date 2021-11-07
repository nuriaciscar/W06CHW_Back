const Robot = require("../../database/models/robots");

const {
  getRobots,
  getRobotsById,
  deleteRobotsById,
} = require("./robotsController");

jest.mock("../../database/models/robots");

describe("Given a getRobots function", () => {
  describe("When it receives an object res", () => {
    test("Then it should invoke the json method", async () => {
      const robots = [
        {
          _id: "1",
          name: "Wall-e",
          url: "http://macmagazine.com.br/blog/wp-content/uploads/2008/06/28-walle021.jpg",
          features: {
            speed: 2,
            stamina: 10,
            creationDate: 2222,
          },
        },
      ];

      Robot.find = jest.fn().mockResolvedValue(robots);

      const res = { json: jest.fn() };

      await getRobots(null, res);

      expect(Robot.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(robots);
    });
  });
});

describe("Given a getRobotsById function", () => {
  describe("When it receives a request with an idRobot 1, a res object and a next function", () => {
    test("Then it should invoke Robot.getById with idRobot 1", async () => {
      Robot.findById = jest.fn().mockResolvedValue({});
      const idRobot = 1;
      const req = {
        params: { idRobot },
      };

      const res = {
        json: () => {},
      };

      const next = () => {};

      await getRobotsById(req, res, next);

      expect(Robot.findById).toHaveBeenCalledWith(idRobot);
    });
  });
  describe("And when Robot.findById is rejected", () => {
    test("Then it should invoke the function next with the error", async () => {
      const error = {};

      Robot.findById = jest.fn().mockRejectedValue(error);

      const req = {
        params: {
          idRobot: 0,
        },
      };

      const res = {};

      const next = jest.fn();

      await getRobotsById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error).toHaveProperty("code");
      expect(error.code).toBe(400);
    });
  });
  describe("And when Robot.findById resolves to Wall-e", () => {
    test("Then it should invoke the res.json with Wall-e", async () => {
      const idRobot = 1;

      const robot = {
        idRobot,
        name: "Wall-e",
      };

      Robot.findById = jest.fn().mockResolvedValue(robot);

      const req = {
        params: {
          idRobot,
        },
      };

      const res = { json: jest.fn() };

      await getRobotsById(req, res);

      expect(res.json).toHaveBeenCalledWith(robot);
    });
  });
});

describe("Given a deleteRobotsById function", () => {
  describe("When it receives a request with an idRobot 1, a res object and a next function", () => {
    test("Then it should delete the robot with id 1 ", async () => {
      const idRobot = 1;
      const robot = {
        idRobot,
        name: "Wall-e",
      };
      Robot.findByIdAndDelete = jest.fn().mockResolvedValue({});

      const req = {
        params: { idRobot },
      };

      const res = {
        json: () => {},
      };

      const next = () => {};

      await deleteRobotsById(req, res, next);

      expect(Robot.findByIdAndDelete).toHaveBeenCalledWith(robot.idRobot);
    });
  });
  describe("And when Robot.findByIdAndDelete is rejected", () => {
    test("Then it should invoke the function next with the error", async () => {
      const error = {};

      Robot.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      const req = {
        params: {
          idRobot: 0,
        },
      };

      const res = {};

      const next = jest.fn();

      await deleteRobotsById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error).toHaveProperty("code");
      expect(error.code).toBe(400);
    });
  });
  describe("And when Robot.findByIdAndDelete resolves 0 robots", () => {
    test("Then it should invoke the res.json with Wall-e", async () => {
      const idRobot = 1;

      const robot = {
        idRobot,
        name: "Wall-e",
      };

      const req = {
        params: {
          idRobot,
        },
      };

      const res = { json: jest.fn() };

      const error = new Error("Robot to delete not found :(");
      error.code = 404;
      const next = jest.fn();

      Robot.deleteRobotsById = jest.fn().mockResolvedValue(robot);

      await deleteRobotsById(req, res, next);

      expect(Robot.findByIdAndDelete).toHaveBeenCalledWith(robot.idRobot);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe("And when Robot.findByIdAndDelete it's invoked and the connection with DB failed", () => {
    test("Then it should invoke next function with an error", async () => {
      const idRobot = 1;

      const robot = {
        idRobot,
        name: "Wall-e",
      };

      const req = {
        params: {
          idRobot,
        },
      };

      const error = new Error();
      error.code = 400;
      error.message = "Cannot delete robot";
      const next = jest.fn();

      Robot.deleteRobotsById = jest.fn().mockRejectedValue(new Error());

      await deleteRobotsById(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
