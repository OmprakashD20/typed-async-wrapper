import type { Request } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";

type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Represents the structure of request parameters for an asynchronous wrapper.
 */
export interface AsyncWrapperRequestParams {
  /** Route parameters parsed from the URL. */
  params: ParamsDictionary;

  /** Request body payload (default type is `unknown` unless overridden). */
  reqBody: unknown;

  /** Query parameters parsed from the URL query string. */
  reqQuery: ParsedQs;
}

/**
 * Utility type to override request parameter types for the `asyncWrapper`.
 *
 * You can selectively override `params`, `reqBody`, and `reqQuery`.
 *
 * @example
 * AsyncWrapperOptions<{ 
 *    params: { id: string }, 
 *    reqBody: { name: string }, 
 *    reqQuery: { search: string } 
 * }>
 */
export type AsyncWrapperOptions<
  Overrides extends Partial<AsyncWrapperRequestParams> = {}
> = Prettify<Overrides & Omit<AsyncWrapperRequestParams, keyof Overrides>>;

/**
 * Standard response structure returned by an asynchronous wrapper.
 *
 * - If `T` is undefined, only `statusCode` is returned.
 * - If `T` is defined, `data` is also included.
 *
 * @template T - Optional type of the data payload.
 */
export type AsyncWrapperResponse<T = undefined> = {
  /** HTTP status code for the response. */
  readonly statusCode: number;

  /** Optional response payload of type `T`. */
  readonly data?: T;
};

/**
 * Typed version of an Express request, extended with support for strongly typed params, body, and query.
 *
 * @template Opts - Overrides for `params`, `reqBody`, and `reqQuery`.
 */
export type AsyncWrapperRequest<Opts extends AsyncWrapperRequestParams> =
  Request<Opts["params"], unknown, Opts["reqBody"], Opts["reqQuery"]>;
