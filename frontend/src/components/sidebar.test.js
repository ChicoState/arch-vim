import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./sidebar";

jest.mock("./themeToggle", () => () => <button>Theme Toggle</button>);
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

const mockUseAuth = jest.fn();
const mockUseTheme = jest.fn();
const mockUseCheckLevel = jest.fn();

jest.mock("../AuthContext", () => ({
    useAuth: () => mockUseAuth(),
}));

jest.mock("../ThemeContext", () => ({
    useTheme: () => mockUseTheme(),
}));

jest.mock("../components/checkLevelPassed", () => ({
    __esModule: true,
    default: () => mockUseCheckLevel(),
}));

beforeEach(() => {
    mockNavigate.mockReset();
    mockUseAuth.mockReturnValue({ user: { username: "testuser" }, logout: jest.fn() });
    mockUseTheme.mockReturnValue({ theme: "dark" });
    mockUseCheckLevel.mockReturnValue(false);
});

test("renders the sidebar title", () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Sidebar />
    </MemoryRouter>
  );

  expect(screen.getByText("Navigation")).toBeInTheDocument();
});

test("renders the main sidebar sections", () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Sidebar />
    </MemoryRouter>
  );

  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Levels")).toBeInTheDocument();
  expect(screen.getByText("Normal Mode Basics")).toBeInTheDocument();
  expect(screen.getByText("Insert Mode")).toBeInTheDocument();
  expect(screen.getByText("Search & Navigation")).toBeInTheDocument();
  expect(screen.getByText("Editing Commands")).toBeInTheDocument();
  expect(screen.getByText("Advanced Tools")).toBeInTheDocument();
  expect(screen.getByText("Challenges")).toBeInTheDocument();
});

test("renders level links", () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Sidebar />
    </MemoryRouter>
  );

  expect(screen.getByText("Basic Navigation")).toBeInTheDocument();
  expect(screen.getByText("How to exit a vim file")).toBeInTheDocument();
  expect(screen.getByText("Insert Mode and typing")).toBeInTheDocument();
  expect(screen.getByText("Basic Search")).toBeInTheDocument();
  expect(screen.getByText("Delete a line")).toBeInTheDocument();
  expect(screen.getByText("Find and replace")).toBeInTheDocument();
  expect(screen.getByText("Challenge - Easy")).toBeInTheDocument();
});

test("level links go to the correct routes", () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Sidebar />
    </MemoryRouter>
  );

  expect(screen.getByText("Basic Navigation").closest("a")).toHaveAttribute(
    "href",
    "/levels/1"
  );

  expect(screen.getByText("How to exit a vim file").closest("a")).toHaveAttribute(
    "href",
    "/levels/2"
  );

  expect(screen.getByText("Insert Mode and typing").closest("a")).toHaveAttribute(
    "href",
    "/levels/3"
  );

  expect(screen.getByText("Challenge - Easy").closest("a")).toHaveAttribute(
    "href",
    "/levels/5"
  );
});

test("can collapse and reopen a sidebar section", () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Sidebar />
    </MemoryRouter>
  );

  expect(screen.getByText("Basic Navigation")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Normal Mode Basics"));

  expect(screen.queryByText("Basic Navigation")).not.toBeInTheDocument();

  fireEvent.click(screen.getByText("Normal Mode Basics"));

  expect(screen.getByText("Basic Navigation")).toBeInTheDocument();
});

test("renders the logged in user and logout button", () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Sidebar />
    </MemoryRouter>
  );

  expect(screen.getByText("testuser")).toBeInTheDocument();
  expect(screen.getByText("Logout")).toBeInTheDocument();
});

test("renders a passed level link in green", () => {
    mockUseCheckLevel.mockReturnValue(true);
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Sidebar />
        </MemoryRouter>
    );
    const link = screen.getByText("Basic Navigation").closest("a");
    expect(link.className).toContain("text-green");
});

test("renders correctly in light theme", () => {
    mockUseTheme.mockReturnValue({ theme: "light" });
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Sidebar />
        </MemoryRouter>
    );
    expect(screen.getByText("Navigation")).toBeInTheDocument();
});

test("logout button calls navigate to /login", () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Sidebar />
        </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Logout"));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
});

test("renders Guest when no user is logged in", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: jest.fn() });
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Sidebar />
        </MemoryRouter>
    );
    expect(screen.getByText("Guest")).toBeInTheDocument();
});
