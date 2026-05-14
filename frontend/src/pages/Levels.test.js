/**
 * @jest-environment jsdom
 */
const React = require("react");
const { render, screen } = require("@testing-library/react");
const { MemoryRouter } = require("react-router-dom");
require("@testing-library/jest-dom");

const Levels = require("./Levels").default;

describe("Levels page", () => {
  it("renders the Levels heading", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Levels />
      </MemoryRouter>
    );

    expect(screen.getByText("Levels")).toBeInTheDocument();
  });

  it("renders all level links", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Levels />
      </MemoryRouter>
    );

    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText("Level 2")).toBeInTheDocument();
    expect(screen.getByText("Level 3")).toBeInTheDocument();
    expect(screen.getByText("Level 4")).toBeInTheDocument();
    expect(screen.getByText("Challenge!")).toBeInTheDocument();
    expect(screen.getByText("Test Level")).toBeInTheDocument();
  });

  it("level links point to the correct routes", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Levels />
      </MemoryRouter>
    );

    expect(screen.getByText("Level 1").closest("a")).toHaveAttribute("href", "/levels/1");
    expect(screen.getByText("Level 2").closest("a")).toHaveAttribute("href", "/levels/2");
    expect(screen.getByText("Level 3").closest("a")).toHaveAttribute("href", "/levels/3");
    expect(screen.getByText("Level 4").closest("a")).toHaveAttribute("href", "/levels/4");
    expect(screen.getByText("Challenge!").closest("a")).toHaveAttribute("href", "/levels/5");
    expect(screen.getByText("Test Level").closest("a")).toHaveAttribute("href", "/levels/test");
  });

  it("renders the level descriptions", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Levels />
      </MemoryRouter>
    );

    expect(screen.getByText(/Learn Navigation/i)).toBeInTheDocument();
    expect(screen.getByText(/How to exit a vim file/i)).toBeInTheDocument();
    expect(screen.getByText(/Insert Mode and typing/i)).toBeInTheDocument();
    expect(screen.getByText(/How to save your changes/i)).toBeInTheDocument();
  });
});