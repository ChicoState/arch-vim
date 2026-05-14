/**
 * @jest-environment jsdom
 */
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router-dom');
require('@testing-library/jest-dom');

jest.mock('../ThemeContext', () => ({
    useTheme: jest.fn(),
}));

const { useTheme } = jest.requireMock('../ThemeContext');
const PassedLevel = require('./passedLevel').default;

beforeEach(() => {
    useTheme.mockReset();
    useTheme.mockReturnValue({ theme: 'dark' });
});

describe('PassedLevel', () => {
    it('renders the passed message', () => {
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><PassedLevel levelNum={3} /></MemoryRouter>);
        expect(screen.getByText('You passed!')).toBeInTheDocument();
    });

    it('links to the next level', () => {
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><PassedLevel levelNum={3} /></MemoryRouter>);
        expect(screen.getByText('Level 4').closest('a')).toHaveAttribute('href', '/levels/4');
    });

    it('links back to home', () => {
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><PassedLevel levelNum={3} /></MemoryRouter>);
        expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    });

    it('uses the correct next level number', () => {
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><PassedLevel levelNum={10} /></MemoryRouter>);
        expect(screen.getByText('Level 11').closest('a')).toHaveAttribute('href', '/levels/11');
    });

    it('defaults to level 0 when no levelNum is passed', () => {
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><PassedLevel /></MemoryRouter>);
        expect(screen.getByText('Level 1').closest('a')).toHaveAttribute('href', '/levels/1');
    });

    it('renders correctly in light mode', () => {
        useTheme.mockReturnValue({ theme: 'light' });
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><PassedLevel levelNum={1} /></MemoryRouter>);
        expect(screen.getByText('You passed!')).toBeInTheDocument();
    });
    it('displays current strokes and time from result prop', () => {
        useTheme.mockReturnValue({ theme: 'dark' });
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <PassedLevel levelNum={1} result={{ strokes: 5, ms: 30000 }} />
        </MemoryRouter>);
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('00:30')).toBeInTheDocument();
    });

    it('displays best clear section when result has bestStrokes', () => {
        useTheme.mockReturnValue({ theme: 'dark' });
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <PassedLevel levelNum={1} result={{ strokes: 5, ms: 30000, bestStrokes: 3, bestMs: 20000 }} />
        </MemoryRouter>);
        expect(screen.getByText('Best Clear')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('00:20')).toBeInTheDocument();
    });

    it('does not display best clear section when no best exists', () => {
        useTheme.mockReturnValue({ theme: 'dark' });
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <PassedLevel levelNum={1} result={{ strokes: 5, ms: 30000 }} />
        </MemoryRouter>);
        expect(screen.queryByText('Best Clear')).not.toBeInTheDocument();
    });

    it('renders stat section in light theme', () => {
        useTheme.mockReturnValue({ theme: 'light' });
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <PassedLevel levelNum={1} result={{ strokes: 5, ms: 30000, bestStrokes: 3, bestMs: 20000 }} />
        </MemoryRouter>);
        expect(screen.getByText('Best Clear')).toBeInTheDocument();
    });
});
