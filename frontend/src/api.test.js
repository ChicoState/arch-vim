/**
 * @jest-environment jsdom
 */
require("@testing-library/jest-dom");

const mockApi = jest.fn();

mockApi.interceptors = {
  request: {
    use: jest.fn(),
  },
  response: {
    use: jest.fn(),
  },
};

jest.mock("axios", () => ({
  create: jest.fn(() => mockApi),
  post: jest.fn(),
}));

require("./api").default;

const requestHandler = mockApi.interceptors.request.use.mock.calls[0][0];
const responseSuccessHandler = mockApi.interceptors.response.use.mock.calls[0][0];
const responseErrorHandler = mockApi.interceptors.response.use.mock.calls[0][1];

beforeEach(() => {
  localStorage.clear();
  mockApi.mockClear();
});

describe("api axios instance", () => {
  it("adds Authorization header when access token exists", () => {
    localStorage.setItem("access", "abc123");

    const config = {
      headers: {},
    };

    const result = requestHandler(config);

    expect(result.headers.Authorization).toBe("Bearer abc123");
  });

  it("does not add Authorization header when token does not exist", () => {
    const config = {
      headers: {},
    };

    const result = requestHandler(config);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it("returns successful responses directly", () => {
    const response = {
      data: {
        ok: true,
      },
    };

    expect(responseSuccessHandler(response)).toBe(response);
  });

  it("rejects non-401 errors", async () => {
    const err = {
      config: {
        headers: {},
      },
      response: {
        status: 500,
      },
    };

    await expect(responseErrorHandler(err)).rejects.toBe(err);
  });

  it("rejects 401 errors that already retried", async () => {
    const err = {
      config: {
        _retry: true,
        headers: {},
      },
      response: {
        status: 401,
      },
    };

    await expect(responseErrorHandler(err)).rejects.toBe(err);
  });
});