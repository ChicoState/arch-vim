/**
 * @jest-environment jsdom
 */
const React = require("react");
const { render, screen, fireEvent } = require("@testing-library/react");
const { MemoryRouter } = require("react-router-dom");
require("@testing-library/jest-dom");

jest.mock("../components/login", () => () => <div>Mock Login</div>);

jest.mock("../editor/vimEditor", () => () => (
  <div>Mock Vim Editor</div>
));

jest.mock("../ThemeContext", () => ({
  useTheme: jest.fn(),
}));

jest.mock("../components/checkLevelPassed", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const { useTheme } = jest.requireMock("../ThemeContext");
const useCheckLevel = jest.requireMock("../components/checkLevelPassed").default;
const Home = require("./Home").default;

let consoleErrorSpy;

beforeEach(() => {
  useTheme.mockReset();
  useCheckLevel.mockReset();

  useTheme.mockReturnValue({ theme: "dark" });
  useCheckLevel.mockReturnValue(false);

  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});

describe("Home page", () => {
  it("renders the home title", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Arch-Vim")).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Learn Vim, One step at a time")).toBeInTheDocument();
  });

  it("renders the mocked login component", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Mock Login")).toBeInTheDocument();
  });

  it("shows the welcome section by default", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("What is Arch-Vim?")).toBeInTheDocument();
    expect(screen.getByText("What is VIM?")).toBeInTheDocument();
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
  });

  it("renders getting started level links", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Learn Navigation").closest("a")).toHaveAttribute("href", "/levels/1");
    expect(screen.getByText("How to exit a vim file").closest("a")).toHaveAttribute("href", "/levels/2");
    expect(screen.getByText("Insert Mode and typing").closest("a")).toHaveAttribute("href", "/levels/3");
    expect(screen.getByText("How to save files").closest("a")).toHaveAttribute("href", "/levels/4");
    expect(screen.getByText("Challenge!").closest("a")).toHaveAttribute("href", "/levels/5");
  });

  it("switches to levels section when Levels button is clicked", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Levels"));

    expect(screen.getByText("Normal Mode Basics")).toBeInTheDocument();
    expect(screen.getByText("Insert Mode")).toBeInTheDocument();
    expect(screen.getByText("Search & Navigation")).toBeInTheDocument();
    expect(screen.getByText("Editing Commands")).toBeInTheDocument();
    expect(screen.getByText("Advanced Tools")).toBeInTheDocument();
    expect(screen.getByText("Challenges")).toBeInTheDocument();
  });

  it("renders level links in the levels section", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Levels"));

    expect(screen.getByText("Basic Navigation").closest("a")).toHaveAttribute("href", "/levels/1");
    expect(screen.getByText("Delete a line").closest("a")).toHaveAttribute("href", "/levels/8");
    expect(screen.getByText("Basic Search").closest("a")).toHaveAttribute("href", "/levels/11");
    expect(screen.getByText("Find and replace").closest("a")).toHaveAttribute("href", "/levels/24");
    expect(screen.getByText("Challenge - Expert").closest("a")).toHaveAttribute("href", "/levels/27");
  });

  it("switches to FAQ section when FAQ button is clicked", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("FAQ"));

    expect(screen.getByText("ATTENTION: Found a swap file...")).toBeInTheDocument();
    expect(screen.getByText("Mock Vim Editor")).toBeInTheDocument();
  });

  it("switches from FAQ back to Welcome", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("FAQ"));
    expect(screen.getByText("ATTENTION: Found a swap file...")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Welcome"));
    expect(screen.getByText("What is Arch-Vim?")).toBeInTheDocument();
  });

  it("switches from Levels back to Welcome", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Levels"));
    expect(screen.getByText("Normal Mode Basics")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Welcome"));
    expect(screen.getByText("What is Arch-Vim?")).toBeInTheDocument();
  });

  it("uses light theme classes when theme is light", () => {
    useTheme.mockReturnValue({ theme: "light" });

    const { container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    expect(container.firstChild.className).toContain("bg-slate-50");
  });

  it("uses dark theme classes when theme is dark", () => {
    const { container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    expect(container.firstChild.className).toContain("bg-gray-950");
  });

  it("uses passed level styling when a level is passed", () => {
    useCheckLevel.mockReturnValue(true);

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    const link = screen.getByText("Learn Navigation").closest("a");
    expect(link.className).toContain("text-green");
  });

  it("uses default level styling when a level is not passed", () => {
    useCheckLevel.mockReturnValue(false);

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    const link = screen.getByText("Learn Navigation").closest("a");
    expect(link.className).toContain("text-gray-100");
  });

  it("uses default light theme level styling when not passed", () => {
    useTheme.mockReturnValue({ theme: "light" });
    useCheckLevel.mockReturnValue(false);

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    const link = screen.getByText("Learn Navigation").closest("a");
    expect(link.className).toContain("text-slate-700");
  });

  it("uses passed light theme level styling when passed", () => {
    useTheme.mockReturnValue({ theme: "light" });
    useCheckLevel.mockReturnValue(true);

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    const link = screen.getByText("Learn Navigation").closest("a");
    expect(link.className).toContain("text-green-600");
  });

  it("updates title and chevron styles when home page scrolls", () => {
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 1000,
    });
  
    const { container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );
  
    const scrollContainer = container.firstChild;
    const titleCard = screen.getByText("Arch-Vim").closest("div");
    const chevron = container.querySelector("svg").closest("div");
  
    Object.defineProperty(scrollContainer, "scrollTop", {
      writable: true,
      configurable: true,
      value: 300,
    });
  
    fireEvent.scroll(scrollContainer);
  
    expect(titleCard.style.opacity).not.toBe("");
    expect(chevron.style.opacity).not.toBe("");
    expect(chevron.style.transform).toContain("rotate");
  });
});
