/**
 * @jest-environment jsdom
 */
require("@testing-library/jest-dom");

const { write, read } = require("./session");

beforeEach(() => {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
});

describe("session utils", () => {
  it("writes data to the app_state cookie", () => {
    write({ username: "testuser", level: 3 });

    expect(document.cookie).toContain("app_state=");
  });

  it("reads data from the app_state cookie", () => {
    const data = {
      username: "testuser",
      level: 3,
    };

    write(data);

    expect(read()).toEqual(data);
  });

  it("returns null when app_state cookie does not exist", () => {
    expect(read()).toBeNull();
  });

  it("returns null when app_state cookie has invalid JSON", () => {
    document.cookie = "app_state=not-valid-json; path=/; SameSite=Lax";

    expect(read()).toBeNull();
  });

  it("supports custom expiration days", () => {
    write({ theme: "dark" }, 1);

    expect(document.cookie).toContain("app_state=");
    expect(read()).toEqual({ theme: "dark" });
  });

  it("overwrites existing app_state cookie", () => {
    write({ level: 1 });
    write({ level: 2 });

    expect(read()).toEqual({ level: 2 });
  });
});