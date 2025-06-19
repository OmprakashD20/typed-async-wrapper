import type { Request, Response } from "express";

import { asyncWrapper } from "../../src";

describe("typed-async-wrapper-unit-testing", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    next = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should send JSON response with status and data", async () => {
    const handler = asyncWrapper(async () => ({
      statusCode: 200,
      data: { message: "OK" },
    }));

    await handler(req as any, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { message: "OK" },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should send response without data when no data provided", async () => {
    const handler = asyncWrapper(async () => ({ statusCode: 204 }));

    await handler(req as any, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it("should call next with error if thrown", async () => {
    const error = new Error("Something went wrong");
    const handler = asyncWrapper(async () => {
      throw error;
    });

    await handler(req as any, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
