import { testClient } from "../lib/test-utils";
import handler from "../pages/api";

describe("GET: /", () => {
  it("Should returns 200 OK status", async () => {
    await testClient(handler).get("/").expect(200);
  });
});

describe("GET: /jon-snow", () => {
  it("Should returns an object with `message` property", async () => {
    await testClient(handler)
      .get("/jon-snow")
      .expect((response) => {
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message");
      });
  });

  it("The message should be equals to `hello jon-snow`", async () => {
    await testClient(handler)
      .get("/jon-snow")
      .expect((response) => {
        expect(response.body.message).toBe("hello jon-snow");
      });
  });
});
