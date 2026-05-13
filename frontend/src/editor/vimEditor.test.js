/**
 * @jest-environment jsdom
 */

jest.mock('monaco-vim', () => ({
  initVimMode: jest.fn(() => ({
    on: jest.fn(),
  })),
  VimMode: {
    Vim: {
      defineEx: jest.fn(),
    },
  },
}));

jest.mock('@monaco-editor/react', () => {
  return function MockEditor({ onMount, defaultValue }) {
    const mockEditorDomNode = {
      style: {},
      appendChild: jest.fn(),
    };

    const editor = {
      value: defaultValue,
      getValue: jest.fn(() => editor.value),
      setValue: jest.fn((newValue) => {
        editor.value = newValue;
      }),
      getPosition: jest.fn(() => ({
        lineNumber: 1,
        column: 1,
      })),
      getDomNode: jest.fn(() => mockEditorDomNode),
      addCommand: jest.fn(),
      onDidChangeCursorSelection: jest.fn(),
      onDidChangeModelContent: jest.fn((callback) => {
        callback();
      }),
      onKeyDown: jest.fn(),
    };

    const monaco = {
      KeyCode: {
        UpArrow: 16,
      },
    };

    onMount(editor, monaco);

    return <div data-testid="mock-editor">{defaultValue}</div>;
  };
});

jest.mock('../progress.js', () => ({
  saveProgress: jest.fn(() => Promise.resolve()),
  loadProgress: jest.fn(() => Promise.resolve({})),
}));

jest.mock('../ThemeContext.js', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

jest.mock('../components/checkLevelPassed.js', () => ({
  useProgress: () => ({
    levelPassed: jest.fn(),
  }),
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VimEditor from './vimEditor';

describe('VimEditor', () => {
  it('renders the editor', () => {
    render(<VimEditor value="hello world" />);

    expect(screen.getByTestId('mock-editor')).toBeInTheDocument();
    expect(screen.getByText('hello world')).toBeInTheDocument();
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

    expect(screen.getByTestId('mock-editor')).toBeInTheDocument();
  });

  it('calls onWin when finalText already matches editor text', async () => {
    const onWin = jest.fn();

    render(
      <VimEditor
        value="correct answer"
        finalText="correct answer"
        onWin={onWin}
      />
    );

    await waitFor(() => {
      expect(onWin).toHaveBeenCalled();
    });
  });
});