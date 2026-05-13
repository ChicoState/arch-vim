/**
 * @jest-environment jsdom
 */
const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
require('@testing-library/jest-dom');

jest.mock('../ThemeContext', () => ({
    useTheme: jest.fn(),
}));

const { useTheme } = jest.requireMock('../ThemeContext');
const ThemeToggle = require('./themeToggle').default;

beforeEach(() => {
    useTheme.mockReset();
});

describe('ThemeToggle', () => {
    it('shows moon icon in dark mode', () => {
        useTheme.mockReturnValue({ theme: 'dark', toggleTheme: jest.fn() });
        render(<ThemeToggle />);
        expect(screen.getByText('🌙')).toBeInTheDocument();
    });

    it('shows sun icon in light mode', () => {
        useTheme.mockReturnValue({ theme: 'light', toggleTheme: jest.fn() });
        render(<ThemeToggle />);
        expect(screen.getByText('🌞')).toBeInTheDocument();
    });

    it('calls toggleTheme when clicked', () => {
        const toggleTheme = jest.fn();
        useTheme.mockReturnValue({ theme: 'dark', toggleTheme });
        const { container } = render(<ThemeToggle />);
        fireEvent.click(container.firstChild);
        expect(toggleTheme).toHaveBeenCalled();
    });

    it('applies indigo background in dark mode', () => {
        useTheme.mockReturnValue({ theme: 'dark', toggleTheme: jest.fn() });
        const { container } = render(<ThemeToggle />);
        expect(container.firstChild.className).toContain('bg-indigo-600');
    });

    it('applies gray background in light mode', () => {
        useTheme.mockReturnValue({ theme: 'light', toggleTheme: jest.fn() });
        const { container } = render(<ThemeToggle />);
        expect(container.firstChild.className).toContain('bg-gray-300');
    });
});
