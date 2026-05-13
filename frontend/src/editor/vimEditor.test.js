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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
const progressMock     = jest.requireMock('../progress.js');

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
  monacoEditorMock._editor   = undefined;
  monacoEditorMock._handlers = {};

  // Make initVimMode return our stub so vimMode.on() works
  monacoVimMock.initVimMode.mockReset();
  monacoVimMock.initVimMode.mockReturnValue(mockVimMode);
  mockVimMode.on.mockClear();

  // Make defineEx store callbacks so we can trigger :commands in tests
  monacoVimMock.VimMode.Vim.defineEx.mockReset();
  monacoVimMock.VimMode.Vim.defineEx.mockImplementation((name, abbrev, cb) => {
    mockExHandlers[`:${abbrev}`] = cb;
  });

  progressMock.saveProgress.mockClear();
  progressMock.loadProgress.mockClear();
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

  it('calls onWin when finalText matches after a content change', async () => {
    const h = renderEditor({
      value: 'correct answer',
      finalText: 'correct answer',
    });

    h.triggerContentChange();

    await waitFor(() => {
      expect(h.onWin).toHaveBeenCalled();
    });
  });
});
