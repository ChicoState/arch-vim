/**
	* @jest-environment jsdom
	*/

const React = require('react');
const { render, screen, fireEvent, waitFor, act } = require('@testing-library/react');
require('@testing-library/jest-dom');

// Mock out all external dependencies
// Factories can't reference variables defined outside them here, so we set up
// the real behavior in beforeEach using jest.requireMock instead

jest.mock('monaco-vim', () => ({
	__esModule: true,
	initVimMode: jest.fn(),
	VimMode: {
		Vim: {
		defineEx: jest.fn(),
		},
	},
}));

jest.mock('@monaco-editor/react', () => {
	const ReactInner = require('react');

	// Named function so we can attach ._editor and ._handlers to it
	// and read them back in tests via jest.requireMock
	const MockEditor = function MockEditor({ onMount, defaultValue }) {
	const hostRef = ReactInner.useRef(null);

	ReactInner.useEffect(() => {
		const handlers = {};
		let value = defaultValue ?? '';

		const editor = {
			getValue: jest.fn(() => value),
			setValue: jest.fn((v) => { value = v; }),
			getPosition: jest.fn(() => ({ lineNumber: 1, column: 1 })),
			getDomNode: jest.fn(() => hostRef.current),
			addCommand: jest.fn(),
			onDidChangeCursorSelection: jest.fn((cb) => { handlers.cursor  = cb; }),
			onDidChangeModelContent: jest.fn((cb) => { handlers.content = cb; }),
			onKeyDown: jest.fn((cb) => { handlers.keydown = cb; }),
		};

		MockEditor._editor   = editor;
		MockEditor._handlers = handlers;

		if (onMount) onMount(editor, { KeyCode: { UpArrow: 16 } });
	}, []);

	return (
		<div data-testid="mock-editor" ref={hostRef}>
			{defaultValue}
		</div>
	);
  };

  return MockEditor;
});


// Mock Components
jest.mock('../progress.js', () => ({
	saveProgress: jest.fn(() => Promise.resolve()),
	loadProgress: jest.fn(() => Promise.resolve({})),
}));

jest.mock('../ThemeContext.js', () => ({
	useTheme: () => ({ theme: 'light' }),
}));

jest.mock('../components/checkLevelPassed.js', () => ({
	useProgress: () => ({ levelPassed: jest.fn() }),
}));

// Grab references to the mocked modules
const monacoVimMock    = jest.requireMock('monaco-vim');
const monacoEditorMock = jest.requireMock('@monaco-editor/react');
const progressMock	   = jest.requireMock('../progress.js');

const VimEditor = require('./vimEditor').default;

// Shared objects that track vim key/command handlers across tests
const mockVimHandlers = {};
const mockExHandlers  = {};

const mockVimMode = {
	on: jest.fn((event, cb) => {
		mockVimHandlers[event] = cb;
	}),
};

beforeEach(() => {
	// Clear out handlers from the previous test
	Object.keys(mockVimHandlers).forEach((k) => delete mockVimHandlers[k]);
	Object.keys(mockExHandlers).forEach((k)  => delete mockExHandlers[k]);

	// Reset editor references
	monacoEditorMock._editor	 = undefined;
	monacoEditorMock._handlers = {};

	// Make initVimMode return our stub so vimMode.on() works
	monacoVimMock.initVimMode.mockReset();
	monacoVimMock.initVimMode.mockReturnValue(mockVimMode);
	mockVimMode.on.mockClear();
    mockVimMode.on.mockImplementation((event, cb) => {
        mockVimHandlers[event] = cb;
    });

	// Make defineEx store callbacks so we can trigger :commands in tests
	monacoVimMock.VimMode.Vim.defineEx.mockReset();
	monacoVimMock.VimMode.Vim.defineEx.mockImplementation((name, abbrev, cb) => {
		mockExHandlers[`:${abbrev}`] = cb;
	});

    progressMock.saveProgress.mockResolvedValue(undefined);
    progressMock.loadProgress.mockResolvedValue({});
});

// Renders the editor and returns helpers for triggering editor events
function renderEditor(props = {}) {
	const onWin = props.onWin ?? jest.fn();
	render(<VimEditor {...props} onWin={onWin} />);

	return {
		onWin,

		triggerContentChange() {
		act(() => { monacoEditorMock._handlers?.content?.(); });
		},

		triggerCursor(line, col) {
		monacoEditorMock._editor?.getPosition.mockReturnValue({ lineNumber: line, column: col });
		act(() => {
			monacoEditorMock._handlers?.cursor?.({
			selection: { positionLineNumber: line, positionColumn: col },
			});
		});
		},

		triggerVimKey(key) {
		act(() => { mockVimHandlers['vim-keypress']?.(key); });
		},

		triggerCommandDone() {
		act(() => { mockVimHandlers['vim-command-done']?.(); });
		},

		triggerExCommand(cmd) {
		act(() => { mockExHandlers[cmd]?.(); });
		},

		triggerKeydown(key) {
		act(() => {
			monacoEditorMock._handlers?.keydown?.({ browserEvent: { key } });
		});
		},
	};
}

describe('VimEditor', () => {
	it('renders the editor', () => {
		render(<VimEditor value="hello world" />);
		expect(screen.getByTestId('mock-editor')).toBeInTheDocument();
	});

	it('renders the reset button by default', () => {
		render(<VimEditor />);
		expect(
		screen.getByRole('button', { name: /reset level/i })
		).toBeInTheDocument();
	});

	it('does not render reset button when showResetLevel is false', () => {
		render(<VimEditor showResetLevel={false} />);
		expect(
		screen.queryByRole('button', { name: /reset level/i })
		).not.toBeInTheDocument();
	});

	it('calls reset when reset button is clicked', () => {
		render(<VimEditor value="starting text" />);
		fireEvent.click(screen.getByRole('button', { name: /reset level/i }));
		expect(monacoEditorMock._editor.setValue).toHaveBeenCalledWith('starting text');
	});

    it('allows winning again after a reset', async () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct' });
        h.triggerContentChange();
        await waitFor(() => expect(h.onWin).toHaveBeenCalledTimes(1));

        fireEvent.click(screen.getByRole('button', { name: /reset level/i }));

        h.triggerContentChange();
        await waitFor(() => expect(h.onWin).toHaveBeenCalledTimes(2));
    });

    it('resets command tracking so the command needs to be used again after reset', async () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct', commands: [':w'] });
        h.triggerExCommand(':w');
        await waitFor(() => expect(h.onWin).toHaveBeenCalledTimes(1));

        fireEvent.click(screen.getByRole('button', { name: /reset level/i }));

        h.triggerContentChange();
        expect(h.onWin).toHaveBeenCalledTimes(1);

        h.triggerExCommand(':w');
        await waitFor(() => expect(h.onWin).toHaveBeenCalledTimes(2));
    });

	it('calls onWin when finalText matches user input', async () => {
		const h = renderEditor({
		value: 'correct answer',
		finalText: 'correct answer',
		});

		h.triggerContentChange();

		await waitFor(() => {
		expect(h.onWin).toHaveBeenCalled();
		});
	});

    it('doesn\'t call onWin when finalText doesn\'t match', () => {
        const h = renderEditor({ value: 'wrong answer', finalText: 'correct answer' });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('calls onWin when content contains target string', async () => {
        const h = renderEditor({ value: 'hello world', finalTextContains: 'hello' });
        h.triggerContentChange();
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('doesnt call onWin when content doesnt contain target string', () => {
        const h = renderEditor({ value: 'goodbye world', finalTextContains: 'hello' });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('calls onWin when content matches the regex', async () => {
        const h = renderEditor({ value: 'hello world', finalTextRegex: /hello/ });
        h.triggerContentChange();
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('does not call onWin when content does not match regex', () => {
        const h = renderEditor({ value: 'goodbye world', finalTextRegex: /hello/ });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('calls onWin when cursor reaches the required line and column', async () => {
        const h = renderEditor({ cursorLine: 3, cursorCol: 5 });
        h.triggerCursor(3, 5);
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('does not call onWin when cursor is on the wrong line', () => {
        const h = renderEditor({ cursorLine: 3, cursorCol: 5 });
        h.triggerCursor(1, 5);
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('does not call onWin when cursor is on the wrong column', () => {
        const h = renderEditor({ cursorLine: 3, cursorCol: 5 });
        h.triggerCursor(3, 1);
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('calls onWin when the required mode is normal (the default)', async () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct', mode: 'normal' });
        h.triggerContentChange();
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('does not call onWin when mode requirement is not yet met', () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct', mode: 'insert' });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('does not call onWin when canWin is false even if all conditions are met', () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct', canWin: false });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();
    });
    it('does not call onWin until the required command is used', async () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct', commands: [':w'] });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();

        h.triggerExCommand(':w');
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('does not call onWin if none of the possibleCommands have been used', () => {
        const h = renderEditor({
            value: 'correct',
            finalText: 'correct',
            possibleCommands: [':w', ':wq'],
        });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('calls onWin once any one of the possibleCommands is used', async () => {
        const h = renderEditor({
            value: 'correct',
            finalText: 'correct',
            possibleCommands: [':w', ':wq'],
        });
        h.triggerExCommand(':w');
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('does not call onWin until the required keystroke is pressed', async () => {
        const keystrokes = ['j'];
        const h = renderEditor({ value: 'correct', finalText: 'correct', keystrokes });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();

        h.triggerKeydown('j');
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('does not call onWin when an unrelated key is pressed', () => {
        const keystrokes = ['j'];
        const h = renderEditor({ value: 'correct', finalText: 'correct', keystrokes });
        h.triggerKeydown('k');
        expect(h.onWin).not.toHaveBeenCalled();
    });
    it('does not call onWin when finalText does not match', () => {
        const h = renderEditor({ value: 'wrong answer', finalText: 'correct answer' });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('calls onWin when content contains the target string', async () => {
        const h = renderEditor({ value: 'hello world', finalTextContains: 'hello' });
        h.triggerContentChange();
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('does not call onWin when content does not contain the target string', () => {
        const h = renderEditor({ value: 'goodbye world', finalTextContains: 'hello' });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('calls onWin when content matches the regex', async () => {
        const h = renderEditor({ value: 'hello world', finalTextRegex: /hello/ });
        h.triggerContentChange();
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('does not call onWin when content does not match the regex', () => {
        const h = renderEditor({ value: 'goodbye world', finalTextRegex: /hello/ });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('calls onWin when cursor reaches the required line and column', async () => {
        const h = renderEditor({ cursorLine: 3, cursorCol: 5 });
        h.triggerCursor(3, 5);
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('does not call onWin when cursor is on the wrong line', () => {
        const h = renderEditor({ cursorLine: 3, cursorCol: 5 });
        h.triggerCursor(1, 5);
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('does not call onWin when cursor is on the wrong column', () => {
        const h = renderEditor({ cursorLine: 3, cursorCol: 5 });
        h.triggerCursor(3, 1);
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('calls onWin when the required mode is normal (the default)', async () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct', mode: 'normal' });
        h.triggerContentChange();
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('does not call onWin when mode requirement is not yet met', () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct', mode: 'insert' });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('does not call onWin when canWin is false even if all conditions are met', () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct', canWin: false });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('canWin blocks win even when triggered by cursor move', () => {
        const h = renderEditor({ cursorLine: 1, cursorCol: 1, canWin: false });
        h.triggerCursor(1, 1);
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('does not call onWin until the required command is used', async () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct', commands: [':w'] });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();

        h.triggerExCommand(':w');
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('does not call onWin if none of the possibleCommands have been used', () => {
        const h = renderEditor({
            value: 'correct',
            finalText: 'correct',
            possibleCommands: [':w', ':wq'],
        });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('calls onWin once any one of the possibleCommands is used', async () => {
        const h = renderEditor({
            value: 'correct',
            finalText: 'correct',
            possibleCommands: [':w', ':wq'],
        });
        h.triggerExCommand(':w');
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('does not call onWin until the required keystroke is pressed', async () => {
        const keystrokes = ['j'];
        const h = renderEditor({ value: 'correct', finalText: 'correct', keystrokes });
        h.triggerContentChange();
        expect(h.onWin).not.toHaveBeenCalled();

        h.triggerKeydown('j');
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('does not call onWin when an unrelated key is pressed', () => {
        const keystrokes = ['j'];
        const h = renderEditor({ value: 'correct', finalText: 'correct', keystrokes });
        h.triggerKeydown('k');
        expect(h.onWin).not.toHaveBeenCalled();
    });

    it('allows winning again after a reset', async () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct' });
        h.triggerContentChange();
        await waitFor(() => expect(h.onWin).toHaveBeenCalledTimes(1));

        fireEvent.click(screen.getByRole('button', { name: /reset level/i }));

        h.triggerContentChange();
        await waitFor(() => expect(h.onWin).toHaveBeenCalledTimes(2));
    });

    it('resets command tracking so the command needs to be used again after reset', async () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct', commands: [':w'] });
        h.triggerExCommand(':w');
        await waitFor(() => expect(h.onWin).toHaveBeenCalledTimes(1));

        fireEvent.click(screen.getByRole('button', { name: /reset level/i }));

        h.triggerContentChange();
        expect(h.onWin).toHaveBeenCalledTimes(1);

        h.triggerExCommand(':w');
        await waitFor(() => expect(h.onWin).toHaveBeenCalledTimes(2));
    });

    it('command-done after a colon command still checks win conditions', async () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct' });
        h.triggerVimKey(':');
        h.triggerCommandDone();
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('clears colon flag on escape so command-done goes through normal branch', async () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct' });
        h.triggerVimKey(':');
        h.triggerVimKey('<Esc>');
        h.triggerCommandDone();
        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });

    it('increments stroke count on command done without throwing', async () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct' });
        h.triggerCommandDone();
        await waitFor(() => expect(h.onWin).toHaveBeenCalledTimes(1));
        h.triggerCommandDone(); // wonRef is now true, hits the early return on line 174
        await new Promise((r) => setTimeout(r, 50));
        expect(h.onWin).toHaveBeenCalledTimes(1);
    });

    it('updates mode to insert when status bar changes', async () => {
        const h = renderEditor({ value: 'correct', finalText: 'correct', mode: 'insert' });
        const editorDiv = screen.getByTestId('mock-editor');
        const statusNode = editorDiv.children[0]; // children[] skips text nodes, firstChild did not

        await act(async () => {
            statusNode.textContent = '-- INSERT --';
            await new Promise((r) => setTimeout(r, 0));
        });

        await waitFor(() => expect(h.onWin).toHaveBeenCalled());
    });
});
