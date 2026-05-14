/**
 * @jest-environment jsdom
 */
const React = require("react");
const { render, screen, fireEvent, waitFor } = require("@testing-library/react");
const { MemoryRouter } = require("react-router-dom");
require("@testing-library/jest-dom");

jest.mock("../AuthContext.js", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../ThemeContext", () => ({
  useTheme: jest.fn(),
}));

jest.mock("../components/themeToggle", () => () => (
  <button>Theme Toggle</button>
));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const { useAuth } = jest.requireMock("../AuthContext.js");
const { useTheme } = jest.requireMock("../ThemeContext");
const Login = require("./Login").default;

beforeEach(() => {
  mockNavigate.mockReset();
  useAuth.mockReset();
  useTheme.mockReset();

  useAuth.mockReturnValue({
    login: jest.fn(),
  });

  useTheme.mockReturnValue({
    theme: "dark",
  });
});

describe("Login page", () => {
  it("renders the login page", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Theme Toggle")).toBeInTheDocument();
  });

  it("renders the sign up link", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("Sign Up Here").closest("a")).toHaveAttribute("href", "/register");
  });

  it("updates the username and password fields", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    expect(screen.getByPlaceholderText("Username")).toHaveValue("testuser");
    expect(screen.getByPlaceholderText("Password")).toHaveValue("password123");
  });

  it("calls login and navigates home on successful submit", async () => {
    const login = jest.fn().mockResolvedValue({});
    useAuth.mockReturnValue({ login });

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("testuser", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows an error message when login fails", async () => {
    const login = jest.fn().mockRejectedValue(new Error("bad login"));
    useAuth.mockReturnValue({ login });

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "wronguser" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Invalid username or password")).toBeInTheDocument();
  });

  it("uses dark theme page styling", () => {
    const { container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </MemoryRouter>
    );

    expect(container.firstChild.className).toContain("bg-gray-950");
  });

  it("uses light theme page styling", () => {
    useTheme.mockReturnValue({ theme: "light" });

    const { container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </MemoryRouter>
    );

    expect(container.firstChild.className).toContain("bg-slate-50");
  });

  it("uses light theme input and link styling", () => {
    useTheme.mockReturnValue({ theme: "light" });

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Username").className).toContain("bg-white");
    expect(screen.getByText("Sign Up Here").className).toContain("text-indigo-600");
  });
});