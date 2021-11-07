const Robot = require("../../database/models/robots");

const { getRobots, getRobotsById } = require("./robotsController");

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

describe("Given a getPetsById function", () => {
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
});
