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
const DropDown = require('./hint').default;

beforeEach(() => {
    useTheme.mockReset();
    useTheme.mockReturnValue({ theme: 'dark' });
});

describe('DropDown', () => {
    it('renders the title', () => {
        render(<DropDown title="Hint" contents="some hint text" />);
        expect(screen.getByText('Hint')).toBeInTheDocument();
    });

    it('content wrapper has max-h-0 when closed by default', () => {
        const { container } = render(<DropDown title="Hint" contents="some hint text" />);
        expect(container.querySelector('.max-h-0')).toBeInTheDocument();
    });

    it('content is in the DOM even when closed', () => {
        render(<DropDown title="Hint" contents="some hint text" />);
        expect(screen.getByText('some hint text')).toBeInTheDocument();
    });

    it('content wrapper expands to max-h-96 when opened', () => {
        const { container } = render(<DropDown title="Hint" contents="some hint text" />);
        fireEvent.click(screen.getByRole('button'));
        expect(container.querySelector('.max-h-96')).toBeInTheDocument();
        expect(container.querySelector('.max-h-0')).not.toBeInTheDocument();
    });

    it('collapses back to max-h-0 when clicked again', () => {
        const { container } = render(<DropDown title="Hint" contents="some hint text" />);
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByRole('button'));
        expect(container.querySelector('.max-h-0')).toBeInTheDocument();
        expect(container.querySelector('.max-h-96')).not.toBeInTheDocument();
    });

    it('shows the down arrow indicator', () => {
        render(<DropDown title="Hint" contents="some hint text" />);
        expect(screen.getByText('▼')).toBeInTheDocument();
    });

    it('rotates the arrow when opened', () => {
        render(<DropDown title="Hint" contents="some hint text" />);
        const arrow = screen.getByText('▼');
        fireEvent.click(screen.getByRole('button'));
        expect(arrow.className).toContain('rotate-180');
    });

    it('renders correctly in light mode', () => {
        useTheme.mockReturnValue({ theme: 'light' });
        render(<DropDown title="Hint" contents="some hint text" />);
        expect(screen.getByText('Hint')).toBeInTheDocument();
    });

    it('applies moreClass to the wrapper', () => {
        const { container } = render(<DropDown title="Hint" contents="text" moreClass="my-custom-class" />);
        expect(container.firstChild.className).toContain('my-custom-class');
    });

    it('renders JSX contents', () => {
        render(<DropDown title="Hint" contents={<span>jsx content</span>} />);
        expect(screen.getByText('jsx content')).toBeInTheDocument();
    });
});
