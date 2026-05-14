/**
 * @jest-environment jsdom
 */
const React = require("react");
const { render, screen } = require("@testing-library/react");
const { MemoryRouter, Routes, Route } = require("react-router-dom");
require("@testing-library/jest-dom");

jest.mock("./AuthContext", () => ({
  useAuth: jest.fn(),
}));

const { useAuth } = jest.requireMock("./AuthContext");
const { ProtectedRoute } = require("./ProtectedRoute");

beforeEach(() => {
  useAuth.mockReset();
});

describe("ProtectedRoute", () => {
  it("shows loading when auth is loading", () => {
    useAuth.mockReturnValue({ user: null, loading: true });

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ProtectedRoute>
          <div>Secret Page</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders children when user is logged in", () => {
    useAuth.mockReturnValue({
      user: { username: "testuser" },
      loading: false,
    });

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ProtectedRoute>
          <div>Secret Page</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Secret Page")).toBeInTheDocument();
  });

  it("redirects to login when user is not logged in", () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    render(
      <MemoryRouter
        initialEntries={["/secret"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route
            path="/secret"
            element={
              <ProtectedRoute>
                <div>Secret Page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Secret Page")).not.toBeInTheDocument();
  });
});