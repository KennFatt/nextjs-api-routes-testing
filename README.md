# Testing NextJS API Routes handler

## Why

> **TL;DR**
>
> - You do want to test your NextJS API Routes without running the server.
> - You do use `next-connect` as your app router or middleware.

My main reason to use this approach is because that I want to use `next-connect` and test them without running the server at all.

If you're not using this package (`next-connect`) and you have a regular API route handler, then you perhaps use simpler (as I assume) approach with `node-mocks-http` and it would be fine.

I could not make `next-connect` and `node-mocks-http` works together and it keep gives me undesired behavior. So, here is my way to solve it.



## Credits

Here's all useful references from people that helps me to solve this problem:

- [Sean Connolly - Unit testing Next.js API routes](https://seanconnolly.dev/unit-testing-nextjs-api-routes)

  Article about integrating and testing Next's API routes with `node-mocks-http` and `jest`.

- [DEV Community - James Harvey's comment](https://dev.to/jamesharv/comment/145f8)

  I thought that James Harvey's solution and implementation is pretty conscise and neat. And I use his implementation for this approach.

- [GitHub `next-connect` issue - leosuncin's comment](https://github.com/hoangvvo/next-connect/issues/84#issuecomment-826031762)



## Development Dependencies

```bash
yarn add supertest jest @types/jest
```

1. [`supertest`](https://github.com/visionmedia/supertest): for testing NodeJS's HTTP server with fluent API.
2. [`jest`](https://github.com/facebook/jest): to run our test suites / specs.
   - `@types/jest`: (optional) to help our IDE (i.e. VS Code) for jest's type acquisition



 Build Dependency

```bash
yarn add next-connect
```

1. [`next-connect`](https://github.com/hoangvvo/next-connect): (optional) allows us to use router and middleware in our NextJS API Route.



## Steps

1. Install all packages (build and dependencies)

2. Create or write `.babelrc` file (optional)

   ```json
   {
     "env": {
       "test": {
         "presets": [
           [
             "next/babel",
             {
              "preset-env": {
                "modules": "commonjs"
              }
             }
           ]
         ]
       }
     }
   }
   ```

   It will allow you to use ES6 `import`-`export` statement in your test files.

3. Create or write `jsconfig.json` file (only if you have `@types/jest` installed)

   ```json
   {
     "typeAcquisition": {
       "include": [
         "jest"
       ]
     }
   }
   ```

4. Write this code somewhere in your project and import to test your API Route handler (an example).


   ```js
   // lib/test-utils.js
   import { createServer } from "http";
   import { apiResolver } from "next/dist/server/api-utils";
   import supertest from "supertest";

   /**
    * @type {import("next").NextApiHandler} handler
    */
   export function testClient(handler) {
     const serverRequestListener = async (req, res) => {
       return apiResolver(
         req, res, undefined, handler, {}, undefined
       );
     };

     const server = createServer(serverRequestListener);

     return supertest(server);
   }
   ```

5. Use that helper function to test our API route handler (an example).

   ```js
   // __test__/hello-api.test.js
   import { testClient } from "../lib/test-utils";
   import handler from "../pages/api/hello";

   describe("GET /api/hello", () => {

     it("Returns 200 OK status", async () => {    // <-- notice the async
       await testClient(handler)
       	.get("/api/hello")
       	.expect(200);                             // <-- supertest's API
     });

   });
   ```

6. And you're done!
