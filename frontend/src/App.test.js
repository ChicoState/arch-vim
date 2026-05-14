/**
 * @jest-environment jsdom
 */
const { render, screen } = require("@testing-library/react");
require("@testing-library/jest-dom");

jest.mock("./App.css", () => ({}));

jest.mock("./AuthContext.js", () => {
  const React = require("react");
  return {
    AuthProvider: ({ children }) =>
      React.createElement("div", { "data-testid": "auth-provider" }, children),
  };
});

jest.mock("./components/checkLevelPassed.js", () => {
  const React = require("react");
  return {
    ProgressProvider: ({ children }) =>
      React.createElement("div", { "data-testid": "progress-provider" }, children),
  };
});

jest.mock("./ThemeContext.js", () => ({
  useTheme: jest.fn(),
}));

jest.mock("react-router-dom", () => {
  const React = require("react");

  return {
    BrowserRouter: ({ children }) =>
      React.createElement("div", { "data-testid": "browser-router" }, children),

    Routes: ({ children }) =>
      React.createElement("div", { "data-testid": "routes" }, children),

    Route: ({ path, element }) =>
      React.createElement("div", { "data-testid": `route-${path}` }, element),
  };
});

jest.mock("./pages/Home.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Home Page");
});

jest.mock("./pages/Login.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Login Page");
});

jest.mock("./pages/Register.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Register Page");
});

jest.mock("./pages/Levels.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Levels Page");
});

jest.mock("./pages/levels/levelTest.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level Test Page");
});

jest.mock("./pages/levels/Level1.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 1 Page");
});
jest.mock("./pages/levels/Level2.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 2 Page");
});
jest.mock("./pages/levels/Level3.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 3 Page");
});
jest.mock("./pages/levels/Level4.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 4 Page");
});
jest.mock("./pages/levels/Level5.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 5 Page");
});
jest.mock("./pages/levels/Level6.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 6 Page");
});
jest.mock("./pages/levels/Level7.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 7 Page");
});
jest.mock("./pages/levels/Level8.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 8 Page");
});
jest.mock("./pages/levels/Level9.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 9 Page");
});
jest.mock("./pages/levels/Level10.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 10 Page");
});
jest.mock("./pages/levels/Level11.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 11 Page");
});
jest.mock("./pages/levels/Level12.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 12 Page");
});
jest.mock("./pages/levels/Level13.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 13 Page");
});
jest.mock("./pages/levels/Level14.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 14 Page");
});
jest.mock("./pages/levels/Level15.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 15 Page");
});
jest.mock("./pages/levels/Level16.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 16 Page");
});
jest.mock("./pages/levels/Level17.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 17 Page");
});
jest.mock("./pages/levels/Level18.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 18 Page");
});
jest.mock("./pages/levels/Level19.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 19 Page");
});
jest.mock("./pages/levels/Level20.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 20 Page");
});
jest.mock("./pages/levels/Level21.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 21 Page");
});
jest.mock("./pages/levels/Level22.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 22 Page");
});
jest.mock("./pages/levels/Level23.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 23 Page");
});
jest.mock("./pages/levels/Level24.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 24 Page");
});
jest.mock("./pages/levels/Level25.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 25 Page");
});
jest.mock("./pages/levels/Level26.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 26 Page");
});
jest.mock("./pages/levels/Level27.js", () => {
  const React = require("react");
  return () => React.createElement("div", null, "Level 27 Page");
});

const React = require("react");
const { useTheme } = jest.requireMock("./ThemeContext.js");
const App = require("./App").default;

beforeEach(() => {
  useTheme.mockReset();
  useTheme.mockReturnValue({ theme: "dark" });
});

describe("App", () => {
  it("wraps the app in ProgressProvider and AuthProvider", () => {
    render(React.createElement(App));

    expect(screen.getByTestId("progress-provider")).toBeInTheDocument();
    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
  });

  it("uses dark theme app styling", () => {
    const { container } = render(React.createElement(App));

    expect(container.querySelector(".bg-slate-950")).toBeInTheDocument();
    expect(container.querySelector(".text-white")).toBeInTheDocument();
  });

  it("uses light theme app styling", () => {
    useTheme.mockReturnValue({ theme: "light" });

    const { container } = render(React.createElement(App));

    expect(container.querySelector(".bg-slate-50")).toBeInTheDocument();
    expect(container.querySelector(".text-slate-900")).toBeInTheDocument();
  });

  it("renders main routes", () => {
    render(React.createElement(App));

    expect(screen.getByTestId("route-/")).toBeInTheDocument();
    expect(screen.getByTestId("route-/login")).toBeInTheDocument();
    expect(screen.getByTestId("route-/register")).toBeInTheDocument();
    expect(screen.getByTestId("route-/levels")).toBeInTheDocument();

    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.getByText("Register Page")).toBeInTheDocument();
    expect(screen.getByText("Levels Page")).toBeInTheDocument();
  });

  it("renders all level routes", () => {
    render(React.createElement(App));

    for (let i = 1; i <= 27; i += 1) {
      expect(screen.getByTestId(`route-/levels/${i}`)).toBeInTheDocument();
      expect(screen.getByText(`Level ${i} Page`)).toBeInTheDocument();
    }
  });

  it("renders the test level route", () => {
    render(React.createElement(App));

    expect(screen.getByTestId("route-/levels/test")).toBeInTheDocument();
    expect(screen.getByText("Level Test Page")).toBeInTheDocument();
  });
});