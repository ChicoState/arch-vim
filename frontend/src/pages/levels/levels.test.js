/**
 * @jest-environment jsdom
 */
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router-dom');
require('@testing-library/jest-dom');

// Mock all heavy dependencies so we're just testing the level page structure
jest.mock('../../editor/vimEditor', () => () => <div data-testid="vim-editor" />);
jest.mock('../../components/sidebar', () => () => <div data-testid="sidebar" />);
jest.mock('../../components/hint', () => () => <div data-testid="hint" />);
jest.mock('../../components/passedLevel', () => () => <div data-testid="passed-level" />);
jest.mock('../../components/checkLevelPassed', () => ({
    __esModule: true,
    default: jest.fn(() => false),
}));
jest.mock('../../ThemeContext', () => ({
    useTheme: () => ({ theme: 'dark' }),
}));

// Runs the same 3 tests against every level file
describe.each(
    Array.from({ length: 27 }, (_, i) => [i + 1])
)('Level %i', (num) => {
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
});
