import express from "express";
import request from "supertest";

import { asyncWrapper, AsyncWrapperOptions } from "../../src";

describe("typed-async-wrapper-integration-testing", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  it("should return typed route params as response when params are provided", async () => {
    app.get(
      "/user/:id",
      asyncWrapper<
        { userId: string },
        AsyncWrapperOptions<{ params: { id: string } }>
      >(async (req) => {
        return {
          statusCode: 200,
          data: { userId: req.params.id },
        };
      })
    );

    const res = await request(app).get("/user/123");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: { userId: "123" } });
  });

  it("should return token when valid typed request body is provided", async () => {
    app.post(
      "/login",
      asyncWrapper<
        { token: string },
        AsyncWrapperOptions<{ reqBody: { email: string; password: string } }>
      >(async (req) => {
        const { email, password } = req.body;
        if (!email || !password) throw new Error("Missing credentials");

        return {
          statusCode: 200,
          data: { token: `${email}:${password}` },
        };
      })
    );

    const res = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "secret" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBe("test@example.com:secret");
  });

  it("handles typed request body only (Opts) with no response data", async () => {
    app.post(
      "/logout",
      asyncWrapper<AsyncWrapperOptions<{ reqBody: { token: string } }>>(
        async (req) => {
          const { token } = req.body;

          if (!token || typeof token !== "string") {
            throw new Error("Invalid token");
          }

          return { statusCode: 204 }; // No content
        }
      )
    );

    const res = await request(app)
      .post("/logout")
      .send({ token: "abc.def.ghi" });

    expect(res.status).toBe(204);
    expect(res.body).toEqual({}); // 204: no content body
  });

  it("should respond with data based on typed query params", async () => {
    app.get(
      "/search",
      asyncWrapper<
        { keyword: string },
        AsyncWrapperOptions<{ reqQuery: { q: string } }>
      >(async (req) => {
        return {
          statusCode: 200,
          data: { keyword: req.query.q },
        };
      })
    );

    const res = await request(app).get("/search?q=typescript");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: { keyword: "typescript" },
    });
  });

  it("should return 204 No Content with empty body when no data is returned", async () => {
    app.post(
      "/ping",
      asyncWrapper(async () => {
        return { statusCode: 204 }; // No content
      })
    );

    const res = await request(app).post("/ping");
    expect(res.status).toBe(204);
    expect(res.body).toEqual({}); // 204: no content body
  });

  it("should forward thrown error to Express error handler and respond with 500", async () => {
    const error = new Error("Oops");

    app.get(
      "/fail",
      asyncWrapper(async () => {
        throw error;
      })
    );

    app.use(
      (
        err: Error,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
      ) => {
        res.status(500).json({ error: err.message });
      }
    );

    const res = await request(app).get("/fail");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Oops" });
  });

  it("should handle response correctly", async () => {
    type ResponseData = {
      id: string;
      name: string;
    };

    app.get(
      "/currentUser",
      asyncWrapper<ResponseData>(async () => {
        const currentUser = { id: "123", name: "John Doe" };
        return {
          statusCode: 200,
          data: currentUser,
        };
      })
    );

    const res = await request(app).get("/currentUser");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: { id: "123", name: "John Doe" },
    });
  });

  it("should process params, body, and query together and return a summary string", async () => {
    app.post(
      "/mix/:id",
      asyncWrapper<
        { summary: string },
        AsyncWrapperOptions<{
          params: { id: string };
          reqBody: { name: string };
          reqQuery: { tag: string };
        }>
      >(async (req) => {
        const { id } = req.params;
        const { name } = req.body;
        const { tag } = req.query;

        return {
          statusCode: 200,
          data: { summary: `${name}(${id}) tagged with ${tag}` },
        };
      })
    );

    const res = await request(app)
      .post("/mix/42?tag=type-safe")
      .send({ name: "typed-wrapper" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: { summary: "typed-wrapper(42) tagged with type-safe" },
    });
  });
});
