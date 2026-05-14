/**
 * @jest-environment jsdom
 */
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router-dom');
const { act } = require('@testing-library/react');
require('@testing-library/jest-dom');

// Mock all heavy dependencies so we're just testing the level page structure
jest.mock('../../components/sidebar', () => () => <div data-testid="sidebar" />);
jest.mock('../../components/hint', () => () => <div data-testid="hint" />);
jest.mock('../../components/passedLevel', () => () => <div data-testid="passed-level" />);
jest.mock('../../components/checkLevelPassed', () => ({
    __esModule: true,
    default: jest.fn(() => false),
}));
jest.mock('../../ThemeContext', () => ({
    useTheme: jest.fn(() => ({ theme: 'dark' })),
}));
const mockOnWin = jest.fn();
jest.mock('../../editor/vimEditor', () => (props) => {
    if (props.onWin) mockOnWin.mockImplementation(props.onWin);
    return <div data-testid="vim-editor" />;
});
beforeEach(() => {
    const themeContext = jest.requireMock('../../ThemeContext');
    themeContext.useTheme.mockReturnValue({ theme: 'dark' });
    const checkLevel = jest.requireMock('../../components/checkLevelPassed');
    checkLevel.default.mockReturnValue(false);
});
jest.mock('../../components/checkLevelPassed', () => ({
    __esModule: true,
    default: jest.fn(() => false),
    useProgress: jest.fn(() => ({ progress: {} })),
}));
beforeEach(() => {
    const checkLevel = jest.requireMock('../../components/checkLevelPassed');
    checkLevel.default.mockReturnValue(false);
    checkLevel.useProgress.mockReturnValue({ progress: {} });
    
    const themeContext = jest.requireMock('../../ThemeContext');
    themeContext.useTheme.mockReturnValue({ theme: 'dark' });
});
describe.each(
    Array.from({ length: 27 }, (_, i) => [i + 1])
)('Level %i passed state', (num) => {
    it('renders PassedLevel when level is already passed', () => {
        const checkLevel = jest.requireMock('../../components/checkLevelPassed');
        checkLevel.default.mockReturnValue(true);
        const Level = require(`./Level${num}`).default;
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Level /></MemoryRouter>);
        expect(screen.getByTestId('passed-level')).toBeInTheDocument();
        checkLevel.default.mockReturnValue(false);
    });
    it('calls onWin and shows PassedLevel', () => {
        const checkLevel = jest.requireMock('../../components/checkLevelPassed');
        checkLevel.default.mockReturnValue(false);
        const Level = require(`./Level${num}`).default;
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Level /></MemoryRouter>);
        act(() => { mockOnWin(); });
        expect(screen.getByTestId('passed-level')).toBeInTheDocument();
    });
    it('renders without crashing', () => {
        const Level = require(`./Level${num}`).default;
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Level /></MemoryRouter>);
    });

    it('shows the level number', () => {
        const Level = require(`./Level${num}`).default;
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Level /></MemoryRouter>);
        expect(screen.getByText(`Level ${num}`)).toBeInTheDocument();
    });

    it('renders the sidebar and vim editor', () => {
        const Level = require(`./Level${num}`).default;
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Level /></MemoryRouter>);
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('vim-editor')).toBeInTheDocument();
    });
    it('renders correctly in light theme', () => {
        const themeContext = jest.requireMock('../../ThemeContext');
        themeContext.useTheme.mockReturnValue({ theme: 'light' });
        const Level = require(`./Level${num}`).default;
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Level /></MemoryRouter>);
        expect(screen.getByText(`Level ${num}`)).toBeInTheDocument();
        themeContext.useTheme.mockReturnValue({ theme: 'dark' });
    });
});

// LevelTest is a dev sandbox — no sidebar, different structure
describe('LevelTest', () => {
    it('renders without crashing', () => {
        const LevelTest = require('./levelTest').default;
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><LevelTest /></MemoryRouter>);
    });

    it('renders the vim editor', () => {
        const LevelTest = require('./levelTest').default;
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><LevelTest /></MemoryRouter>);
        expect(screen.getByTestId('vim-editor')).toBeInTheDocument();
    });

    it('shows win message when onWin is called', () => {
        const LevelTest = require('./levelTest').default;
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><LevelTest /></MemoryRouter>);
        act(() => { mockOnWin(); });
        expect(screen.getByText('winner winner chicken dinner')).toBeInTheDocument();
    });
});
