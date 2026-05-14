/**
 * @jest-environment jsdom
 */
const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const { MemoryRouter } = require('react-router-dom');
require('@testing-library/jest-dom');

jest.mock('../AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../ThemeContext', () => ({
    useTheme: jest.fn(),
}));

const { useAuth } = jest.requireMock('../AuthContext');
const { useTheme } = jest.requireMock('../ThemeContext');
const Login = require('./login').default;

beforeEach(() => {
    useAuth.mockReset();
    useTheme.mockReset();
    useAuth.mockReturnValue({ user: null, logout: jest.fn() });
    useTheme.mockReturnValue({ theme: 'dark', toggleTheme: jest.fn() });
});

describe('Login nav component', () => {
    it('shows login link when no user is logged in', () => {
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Login /></MemoryRouter>);
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('login link points to /login', () => {
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Login /></MemoryRouter>);
        expect(screen.getByText('Login').closest('a')).toHaveAttribute('href', '/login');
    });

    it('shows username when user is logged in', () => {
        useAuth.mockReturnValue({ user: { username: 'testuser' }, logout: jest.fn() });
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Login /></MemoryRouter>);
        expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('shows logout button when user is logged in', () => {
        useAuth.mockReturnValue({ user: { username: 'testuser' }, logout: jest.fn() });
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Login /></MemoryRouter>);
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('does not show login link when user is logged in', () => {
        useAuth.mockReturnValue({ user: { username: 'testuser' }, logout: jest.fn() });
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Login /></MemoryRouter>);
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });

    it('calls logout when logout button is clicked', () => {
        const logout = jest.fn();
        useAuth.mockReturnValue({ user: { username: 'testuser' }, logout });
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Login /></MemoryRouter>);
        fireEvent.click(screen.getByText('Logout'));
        expect(logout).toHaveBeenCalled();
    });

    it('shows Light Mode button in dark mode', () => {
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Login /></MemoryRouter>);
        expect(screen.getByText('Light Mode')).toBeInTheDocument();
    });

    it('shows Dark Mode button in light mode', () => {
        useTheme.mockReturnValue({ theme: 'light', toggleTheme: jest.fn() });
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Login /></MemoryRouter>);
        expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    });

    it('calls toggleTheme when theme button is clicked', () => {
        const toggleTheme = jest.fn();
        useTheme.mockReturnValue({ theme: 'dark', toggleTheme });
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Login /></MemoryRouter>);
        fireEvent.click(screen.getByText('Light Mode'));
        expect(toggleTheme).toHaveBeenCalled();
    });
});
