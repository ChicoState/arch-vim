/**
 * @jest-environment jsdom
 */
const React = require("react");
const { render, screen, waitFor, fireEvent } = require("@testing-library/react");
require("@testing-library/jest-dom");

jest.mock("./api", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock("./components/checkLevelPassed", () => ({
  useProgress: jest.fn(),
  fetchProgress: jest.fn(),
}));

const api = require("./api");
const { useProgress } = jest.requireMock("./components/checkLevelPassed");
const { AuthProvider, useAuth } = require("./AuthContext");

let clearProgress;
let fetchProgress;
let consoleLogSpy;

function AuthConsumer() {
  const { user, login, logout, loading } = useAuth();

  return (
    <div>
      <p>Loading: {loading ? "yes" : "no"}</p>
      <p>User: {user ? user.username : "none"}</p>
      <button onClick={() => login("testuser", "password123")}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();

  api.get.mockReset();
  api.post.mockReset();

  clearProgress = jest.fn();
  fetchProgress = jest.fn();

  useProgress.mockReset();
  useProgress.mockReturnValue({
    clearProgress,
    fetchProgress,
  });

  consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  consoleLogSpy.mockRestore();
});

describe("AuthContext", () => {
  it("sets loading false when there is no stored token", async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Loading: no")).toBeInTheDocument();
    });

    expect(screen.getByText("User: none")).toBeInTheDocument();
    expect(api.get).not.toHaveBeenCalled();
  });

  it("loads current user when access token exists", async () => {
    localStorage.setItem("access", "stored-token");

    api.get.mockResolvedValue({
      data: {
        username: "storeduser",
      },
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("User: storeduser")).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith("/api/auth/me/");
    expect(fetchProgress).toHaveBeenCalled();
    expect(screen.getByText("Loading: no")).toBeInTheDocument();
  });

  it("clears localStorage when loading current user fails", async () => {
    localStorage.setItem("access", "bad-token");

    api.get.mockRejectedValue(new Error("auth failed"));

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Loading: no")).toBeInTheDocument();
    });

    expect(localStorage.getItem("access")).toBeNull();
  });

  it("login saves tokens, loads user, clears old progress, and fetches progress", async () => {
    api.post.mockResolvedValue({
      data: {
        access: "access-token",
        refresh: "refresh-token",
      },
    });

    api.get.mockResolvedValue({
      data: {
        username: "testuser",
      },
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Loading: no")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("User: testuser")).toBeInTheDocument();
    });

    expect(clearProgress).toHaveBeenCalled();
    expect(api.post).toHaveBeenCalledWith("/api/auth/login/", {
      username: "testuser",
      password: "password123",
    });
    expect(localStorage.getItem("access")).toBe("access-token");
    expect(localStorage.getItem("refresh")).toBe("refresh-token");
    expect(api.get).toHaveBeenCalledWith("/api/auth/me/");
    expect(fetchProgress).toHaveBeenCalled();
  });

  it("logout clears progress, clears localStorage, and removes user", async () => {
    localStorage.setItem("access", "access-token");
    localStorage.setItem("refresh", "refresh-token");

    api.get.mockResolvedValue({
      data: {
        username: "testuser",
      },
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("User: testuser")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Logout"));

    expect(clearProgress).toHaveBeenCalled();
    expect(localStorage.getItem("access")).toBeNull();
    expect(localStorage.getItem("refresh")).toBeNull();
    expect(screen.getByText("User: none")).toBeInTheDocument();
  });
});