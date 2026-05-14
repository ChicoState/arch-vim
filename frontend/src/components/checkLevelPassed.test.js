/**
 * @jest-environment jsdom
 */
const React = require('react');
const { render, screen, act } = require('@testing-library/react');
require('@testing-library/jest-dom');

jest.mock('../progress', () => ({
    loadProgress: jest.fn(),
}));

const { loadProgress } = jest.requireMock('../progress');
const { ProgressProvider, useProgress } = require('./checkLevelPassed');
const useCheckLevel = require('./checkLevelPassed').default;

beforeEach(() => {
    loadProgress.mockReset();
    loadProgress.mockResolvedValue({});
});

// Reads context and passes it out via callback so tests can inspect it
function ProgressConsumer({ onRender }) {
    const ctx = useProgress();
    onRender(ctx);
    return null;
}

// Reads useCheckLevel result and passes it out via callback
function LevelConsumer({ levelNum, onResult }) {
    const passed = useCheckLevel(levelNum);
    onResult(passed);
    return null;
}

describe('ProgressProvider', () => {
    it('renders children', () => {
        render(
            <ProgressProvider>
                <div>child content</div>
            </ProgressProvider>
        );
        expect(screen.getByText('child content')).toBeInTheDocument();
    });

    it('provides progress, loading, clearProgress, fetchProgress, and levelPassed', () => {
        let ctx;
        render(
            <ProgressProvider>
                <ProgressConsumer onRender={(c) => { ctx = c; }} />
            </ProgressProvider>
        );
        expect(ctx).toHaveProperty('progress');
        expect(ctx).toHaveProperty('loading');
        expect(ctx).toHaveProperty('clearProgress');
        expect(ctx).toHaveProperty('fetchProgress');
        expect(ctx).toHaveProperty('levelPassed');
    });

    it('progress starts as empty object', () => {
        let ctx;
        render(
            <ProgressProvider>
                <ProgressConsumer onRender={(c) => { ctx = c; }} />
            </ProgressProvider>
        );
        expect(ctx.progress).toEqual({});
    });

    it('levelPassed updates progress state for that level', () => {
        let ctx;
        render(
            <ProgressProvider>
                <ProgressConsumer onRender={(c) => { ctx = c; }} />
            </ProgressProvider>
        );
        act(() => { ctx.levelPassed(5); });
        expect(ctx.progress).toEqual({ level_5: { passed: true } });
    });

    it('levelPassed preserves existing progress', () => {
        let ctx;
        render(
            <ProgressProvider>
                <ProgressConsumer onRender={(c) => { ctx = c; }} />
            </ProgressProvider>
        );
        act(() => { ctx.levelPassed(1); });
        act(() => { ctx.levelPassed(2); });
        expect(ctx.progress).toHaveProperty('level_1');
        expect(ctx.progress).toHaveProperty('level_2');
    });

    it('clearProgress resets progress to empty', () => {
        let ctx;
        render(
            <ProgressProvider>
                <ProgressConsumer onRender={(c) => { ctx = c; }} />
            </ProgressProvider>
        );
        act(() => { ctx.levelPassed(1); });
        act(() => { ctx.clearProgress(); });
        expect(ctx.progress).toEqual({});
    });

    it('fetchProgress calls loadProgress', async () => {
        loadProgress.mockResolvedValue({ level_3: { passed: true } });
        let ctx;
        render(
            <ProgressProvider>
                <ProgressConsumer onRender={(c) => { ctx = c; }} />
            </ProgressProvider>
        );
        await act(async () => { ctx.fetchProgress(); });
        expect(loadProgress).toHaveBeenCalled();
    });
});

describe('useProgress', () => {
    it('throws when used outside ProgressProvider', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => {
            render(<ProgressConsumer onRender={() => {}} />);
        }).toThrow('useProgress must be used inside <ProgressProvider>');
        spy.mockRestore();
    });
});

describe('useCheckLevel', () => {
    it('returns false when level has not been passed', () => {
        let result;
        render(
            <ProgressProvider>
                <LevelConsumer levelNum={1} onResult={(r) => { result = r; }} />
            </ProgressProvider>
        );
        expect(result).toBe(false);
    });

    it('returns true after levelPassed is called for that level', () => {
        let ctx;
        let result;
        render(
            <ProgressProvider>
                <ProgressConsumer onRender={(c) => { ctx = c; }} />
                <LevelConsumer levelNum={1} onResult={(r) => { result = r; }} />
            </ProgressProvider>
        );
        act(() => { ctx.levelPassed(1); });
        expect(result).toBe(true);
    });

    it('returns false for a different level than the one passed', () => {
        let ctx;
        let result;
        render(
            <ProgressProvider>
                <ProgressConsumer onRender={(c) => { ctx = c; }} />
                <LevelConsumer levelNum={2} onResult={(r) => { result = r; }} />
            </ProgressProvider>
        );
        act(() => { ctx.levelPassed(1); });
        expect(result).toBe(false);
    });

    it('defaults to level 0 when no argument is passed', () => {
        let ctx;
        let result;
        render(
            <ProgressProvider>
                <ProgressConsumer onRender={(c) => { ctx = c; }} />
                <LevelConsumer levelNum={undefined} onResult={(r) => { result = r; }} />
            </ProgressProvider>
        );
        act(() => { ctx.levelPassed(0); });
        expect(result).toBe(true);
    });
});
