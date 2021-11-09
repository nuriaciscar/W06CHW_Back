const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/users");
require("dotenv").config();

jest.mock("../../database/models/users");
jest.mock("bcrypt");

const { loginUser } = require("./userController");

describe("Given a loginUser function ", () => {
  describe("When it receives a wrong username ", () => {
    test("Then it should invoke a next function with an error 401", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      const req = {
        body: {
          username: "luis",
          password: "luis",
        },
      };

      const next = jest.fn();
      const expectedError = new Error("Not found");
      expectedError.code = 401;

      await loginUser(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      ); // Si está mockeado tiene una propiedad mock y calls
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
  describe("When it receives a wrong password ", () => {
    test("Then it should invoke a next function with an error 401", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        id: "2",
        username: "luis",
        password: "luis",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      jwt.sign();
      const req = {
        body: {
          username: "luis",
          password: "luis",
        },
      };

      const next = jest.fn();

      await loginUser(req, null, next);

      const expectedError = new Error("Incorrect password");
      expectedError.code = 401;

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
  describe("When it receives a right username and password", () => {
    test("Then it should invoke res.json with an object with a brand new token inside", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        id: "2",
        username: "Luis",
        password: "Luis",
      });
      const expectedToken = "papaya";
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedToken);
      const req = {
        body: {
          username: "Luis",
          password: "Luis",
        },
      };

      const res = {
        json: jest.fn(),
      };

      const expectedResponse = {
        token: expectedToken,
      };

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalled(expectedResponse);
    });
  });
});
