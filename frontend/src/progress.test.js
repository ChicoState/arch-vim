/**
 * @jest-environment jsdom
 */
require("@testing-library/jest-dom");

jest.mock("./api.js", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

const api = require("./api.js");
const { loadProgress, saveProgress } = require("./progress");

let consoleErrorSpy;

beforeEach(() => {
  api.get.mockReset();
  api.post.mockReset();
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});

describe("progress helpers", () => {
  it("loadProgress returns progress data when api call succeeds", async () => {
    api.get.mockResolvedValue({
      data: {
        level_1: { passed: true },
      },
    });

    const result = await loadProgress();

    expect(api.get).toHaveBeenCalledWith("/api/progress/");
    expect(result).toEqual({
      level_1: { passed: true },
    });
  });

  it("loadProgress returns empty object when api call fails", async () => {
    api.get.mockRejectedValue(new Error("Network Error"));

    const result = await loadProgress();

    expect(api.get).toHaveBeenCalledWith("/api/progress/");
    expect(result).toEqual({});
  });

  it("saveProgress posts progress data", async () => {
    api.post.mockResolvedValue({ data: { ok: true } });

    const data = {
      level_2: { passed: true },
    };

    await saveProgress(data);

    expect(api.post).toHaveBeenCalledWith("/api/progress/save/", data);
  });

  it("saveProgress catches errors and logs them", async () => {
    const err = new Error("Save failed");
    api.post.mockRejectedValue(err);

    await saveProgress({ level_3: { passed: true } });

    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to save progress", err);
  });
});