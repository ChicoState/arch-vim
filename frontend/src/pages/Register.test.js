/**
 * @jest-environment jsdom
 */
const React = require("react");
const { render, screen, fireEvent, waitFor } = require("@testing-library/react");
const { MemoryRouter } = require("react-router-dom");
require("@testing-library/jest-dom");

jest.mock("axios", () => ({
  post: jest.fn(),
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

const axios = require("axios");
const { useTheme } = jest.requireMock("../ThemeContext");
const Register = require("./Register").default;

let consoleErrorSpy;

beforeEach(() => {
  mockNavigate.mockReset();
  axios.post.mockReset();
  useTheme.mockReset();

  useTheme.mockReturnValue({
    theme: "dark",
  });

  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});

describe("Register page", () => {
  it("renders the register page", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Register" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email (optional)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Theme Toggle")).toBeInTheDocument();
  });

  it("renders the login link", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByText("Login").closest("a")).toHaveAttribute("href", "/login");
  });

  it("updates username, email, and password fields", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email (optional)"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    expect(screen.getByPlaceholderText("Username")).toHaveValue("testuser");
    expect(screen.getByPlaceholderText("Email (optional)")).toHaveValue("test@example.com");
    expect(screen.getByPlaceholderText("Password")).toHaveValue("password123");
  });

  it("posts register data and navigates to login on success", async () => {
    axios.post.mockResolvedValue({ data: { ok: true } });

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email (optional)"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/api/auth/register/", {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("shows backend error message when register fails with response error", async () => {
    axios.post.mockRejectedValue({
      response: {
        status: 400,
        data: {
          error: "Username already exists",
        },
      },
    });

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(await screen.findByText("Username already exists")).toBeInTheDocument();
  });

  it("shows default error message when register fails without response error", async () => {
    axios.post.mockRejectedValue(new Error("Network Error"));

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Register />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(await screen.findByText("Registration failed")).toBeInTheDocument();
  });

  it("clears old error before submitting again", async () => {
    axios.post
      .mockRejectedValueOnce({
        response: {
          data: {
            error: "Username already exists",
          },
        },
      })
      .mockResolvedValueOnce({ data: { ok: true } });

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Register />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(await screen.findByText("Username already exists")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("uses dark theme page styling", () => {
    const { container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Register />
      </MemoryRouter>
    );

    expect(container.firstChild.className).toContain("bg-gray-950");
  });

  it("uses light theme page styling", () => {
    useTheme.mockReturnValue({ theme: "light" });

    const { container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Register />
      </MemoryRouter>
    );

    expect(container.firstChild.className).toContain("bg-slate-50");
  });

  it("uses light theme input and link styling", () => {
    useTheme.mockReturnValue({ theme: "light" });

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Username").className).toContain("bg-white");
    expect(screen.getByText("Login").className).toContain("text-indigo-600");
  });
});