# 📦 typed-async-wrapper

> Type-safe async error-handling wrapper for Express.js routes — with full TypeScript support for `params`, `body`, `query`, and structured responses.

![npm](https://img.shields.io/npm/v/typed-async-wrapper.svg)
![npm downloads](https://img.shields.io/npm/dm/typed-async-wrapper.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node](https://img.shields.io/badge/Node.js-18%2B-green.svg?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg?logo=typescript)
![Express Compatibility](https://img.shields.io/badge/Express.js-4.x%20%7C%205.x%20compatible-lightgrey)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/OmprakashD20/typed-async-wrapper/pulls)

---

## 📚 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [Feedback](#-feedback)
<!-- - [Future Improvements](#-future-improvements) -->

---

## ✨ Features

- ✅ **Type-safe** request objects (`params`, `body`, `query`)
- ✅ **Typed response** with optional `data`
- ✅ **Automatic error forwarding** via `next(error)`
- ✅ **Minimal API** — plug & play into any Express route
- ✅ **Fully compatible** with TypeScript & `express@^4.x`

---

## 📦 Installation

```bash
npm install typed-async-wrapper 
````

or

```bash
yarn add typed-async-wrapper
```

---

## 🚀 Quick Start

### 📁 Import

```ts
import { asyncWrapper, AsyncWrapperOptions } from "typed-async-wrapper";
```

### ✅ Typed Response with Request Parameters

```ts
app.get(
  "/hello/:name",
  asyncWrapper<
    { message: string },
    AsyncWrapperOptions<{ params: { name: string } }>
  >(async (req) => {
    const { name } = req.params;
    return {
      statusCode: 200,
      data: { message: `Hello, ${name}!` },
    };
  })
);
```

### ✅ Only Request Parameters (No Response Data)

```ts
app.post(
  "/login",
  asyncWrapper<
    AsyncWrapperOptions<{
      reqBody: { email: string; password: string };
    }>
  >(async (req) => {
    const { email, password } = req.body;
    // Authenticate user here
    await loginUser(email, password);
    return { statusCode: 201 };
  })
);
```

### 🧪 No Request or Response Data (Just Status)

```ts
app.post(
  "/ping",
  asyncWrapper(async () => {
    return { statusCode: 204 };
  })
);
```

---

## 🧠 API Reference

### `asyncWrapper<T, Opts>(fn)`

Wraps an async controller with typed request and response handling, and forwards errors using `next()`.

#### Generics

| Generic | Description                                        |
| ------- | -------------------------------------------------- |
| `T`     | Optional type for `data` in the response           |
| `Opts`  | Request type overrides using `AsyncWrapperOptions` |


### `AsyncWrapperOptions<Overrides>`

Override parts of the request type (`params`, `reqBody`, `reqQuery`) with your custom types.

#### Example:

```ts
type ReqBody = AsyncWrapperOptions<{
  reqBody: { name: string };
}>;

type CustomRequest = AsyncWrapperOptions<{
  params: { userId: string };
  reqBody: { name: string };
  reqQuery: { search: string };
}>;
```

### `AsyncWrapperRequest<Opts>`

Typed Express request using generics:

```ts
type AsyncWrapperRequest<Opts> = Request<
  Opts["params"],
  unknown,
  Opts["reqBody"],
  Opts["reqQuery"]
>;
```

### `AsyncWrapperResponse<T>`

```ts
type AsyncWrapperResponse<T = undefined> = {
  statusCode: number;
  data?: T;
};
```

---

## 🧑‍💻 Contributing

Contributions, issues, and discussions are welcome!

1. Fork this repo
2. Run `npm install` or `yarn install`
3. Make your changes
4. Add relevant tests
5. Open a PR 🙌

---

<!-- ## 📈 Future Improvements

✅ = done, 🧪 = in testing, 📝 = planned

--- -->

## 💬 Feedback?

Have feature requests, found a bug, or want to say thanks?

* ⭐ Star this repo
* 🐛 Report issues
* 🤝 Open PRs
* 💡 Suggest features

Let’s build something awesome together!
