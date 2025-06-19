import type { Response, NextFunction } from "express";

import type {
  AsyncWrapperRequest,
  AsyncWrapperRequestParams,
  AsyncWrapperResponse,
} from "../types/wrapper";

/**
 * Creates an asynchronous Express middleware wrapper.
 *
 * This function wraps an asynchronous function.
 * It returns an Express middleware function that awaits the promise returned by fn, and then constructs and sends a JSON response based on the result. If the async function throws an error, the error is passed to the next middleware.
 *
 * @template T - The type of the data included in the AsyncWrapperResponse.
 * @template Opts - The type parameter for request parameters, extends AsyncWrapperRequestParams.
 *
 * @param fn - An asynchronous function which takes an Express request and response, and returns a promise resolving to an AsyncWrapperResponse. The response object may include a statusCode and optional data.
 *
 * @returns An Express middleware function that handles asynchronous operations and sends a standardized JSON response.
 *
 * @example
 * // With response data and request parameters(params, body, query)
 * app.get("/:name", asyncWrapper<
 *    { message: string },
 *    AsyncWrapperOptions<{ params: { name: string } }>
 *  >(async (req) => {
 *    const { name } = req.params;
 * 
 *    return {
 *      statusCode: 200,
 *      data: { message: `Hello, ${name}!` },
 *    };
 *  })
 * );
 * 
 * // With request parameters (params, body, query) and no response data
 * app.post("/login", asyncWrapper<
 *    AsyncWrapperOptions<{ reqBody: { email: string, password: string } }>
 *  >(async (req) => {
 *    const { email, password } = req.body;
 *    
 *    // Hash the password, validate the user, etc.
 *    await loginUser(email, password);
 *    return {
 *      statusCode: 201,
 *    };
 *  })
 * );
 *
 * // Without response data
 * app.post("/ping", asyncWrapper(async () => {
 *   return { statusCode: 204 };
 * }));
 */

export function asyncWrapper<T, Opts extends AsyncWrapperRequestParams>(
  fn: (
    req: AsyncWrapperRequest<Opts>,
    res: Response
  ) => Promise<AsyncWrapperResponse<T>>
): (
  req: AsyncWrapperRequest<Opts>,
  res: Response,
  next: NextFunction
) => Promise<void>;

export function asyncWrapper<Opts extends AsyncWrapperRequestParams>(
  fn: (
    req: AsyncWrapperRequest<Opts>,
    res: Response
  ) => Promise<AsyncWrapperResponse>
): (
  req: AsyncWrapperRequest<Opts>,
  res: Response,
  next: NextFunction
) => Promise<void>;

export function asyncWrapper<T>(
  fn: (
    req: AsyncWrapperRequest<AsyncWrapperRequestParams>,
    res: Response
  ) => Promise<AsyncWrapperResponse<T>>
): (
  req: AsyncWrapperRequest<AsyncWrapperRequestParams>,
  res: Response,
  next: NextFunction
) => Promise<void>;

export function asyncWrapper<
  T = undefined,
  Opts extends AsyncWrapperRequestParams = AsyncWrapperRequestParams
>(
  fn: (
    req: AsyncWrapperRequest<Opts>,
    res: Response
  ) => Promise<AsyncWrapperResponse<T>>
) {
  return async (
    req: AsyncWrapperRequest<Opts>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await fn(req, res);
      const { statusCode } = result;
      const data = "data" in result ? result.data : undefined;

      res
        .status(statusCode)
        .json({ success: true, ...(data !== undefined ? { data } : {}) });
    } catch (error) {
      next(error);
    }
  };
}
