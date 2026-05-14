/**
 * @jest-environment jsdom
 */
const React = require("react");
const { render, screen, fireEvent } = require("@testing-library/react");
require("@testing-library/jest-dom");

const { ThemeProvider, useTheme } = require("./ThemeContext");

function ThemeConsumer() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme("light")}>Set Light</button>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
    </div>
  );
}

function BrokenConsumer() {
  useTheme();
  return <div>Broken</div>;
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

describe("ThemeContext", () => {
  it("defaults to dark theme when localStorage has no theme", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByText("Theme: dark")).toBeInTheDocument();
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("loads theme from localStorage", () => {
    localStorage.setItem("theme", "light");

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByText("Theme: light")).toBeInTheDocument();
  });

  it("toggles from dark to light", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText("Toggle Theme"));

    expect(screen.getByText("Theme: light")).toBeInTheDocument();
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("toggles from light to dark", () => {
    localStorage.setItem("theme", "light");

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText("Toggle Theme"));

    expect(screen.getByText("Theme: dark")).toBeInTheDocument();
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("allows setTheme to update the theme directly", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText("Set Light"));
    expect(screen.getByText("Theme: light")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Set Dark"));
    expect(screen.getByText("Theme: dark")).toBeInTheDocument();
  });

  it("throws when useTheme is used outside ThemeProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<BrokenConsumer />)).toThrow(
      "useTheme must be used inside ThemeProvider"
    );

    spy.mockRestore();
  });
});