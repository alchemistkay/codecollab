import { useEffect, useRef } from 'react';
import { Editor, loader } from '@monaco-editor/react';

// ─── Custom theme definition ──────────────────────────────────────────────────
let themeRegistered = false;

function ensureTheme() {
  if (themeRegistered) return;
  themeRegistered = true;

  loader.init().then(monaco => {
    monaco.editor.defineTheme('codecollab-dark', {
      base: 'vs-dark',
      inherit: false,
      rules: [
        // Base
        { token: '',                          foreground: 'e2e2da' },
        // Comments
        { token: 'comment',                   foreground: '3d3d3a', fontStyle: 'italic' },
        { token: 'comment.doc',               foreground: '4a4a47', fontStyle: 'italic' },
        // Keywords
        { token: 'keyword',                   foreground: '60a5fa', fontStyle: 'bold' },
        { token: 'keyword.control',           foreground: '60a5fa', fontStyle: 'bold' },
        { token: 'keyword.operator',          foreground: '94a3b8' },
        { token: 'storage',                   foreground: '60a5fa' },
        { token: 'storage.type',              foreground: '60a5fa' },
        // Strings
        { token: 'string',                    foreground: 'fb923c' },
        { token: 'string.escape',             foreground: 'f97316' },
        { token: 'string.template',           foreground: 'fb923c' },
        // Numbers & booleans
        { token: 'number',                    foreground: 'fbbf24' },
        { token: 'constant.language',         foreground: '60a5fa' },
        { token: 'constant.numeric',          foreground: 'fbbf24' },
        // Functions / methods
        { token: 'entity.name.function',      foreground: '4ade80' },
        { token: 'support.function',          foreground: '4ade80' },
        { token: 'meta.function-call',        foreground: '4ade80' },
        // Classes / types
        { token: 'entity.name.class',         foreground: 'a78bfa' },
        { token: 'entity.name.type',          foreground: 'a78bfa' },
        { token: 'support.class',             foreground: 'a78bfa' },
        { token: 'support.type',              foreground: '34d399' },
        // Variables
        { token: 'variable',                  foreground: 'e2e2da' },
        { token: 'variable.language',         foreground: '94a3b8' },
        { token: 'variable.parameter',        foreground: 'fcd34d' },
        // Operators & punctuation
        { token: 'operator',                  foreground: '94a3b8' },
        { token: 'delimiter',                 foreground: '52524f' },
        { token: 'punctuation',               foreground: '52524f' },
        { token: 'delimiter.bracket',         foreground: '7c7c79' },
        // HTML/JSX tags
        { token: 'tag',                       foreground: 'f87171' },
        { token: 'attribute.name',            foreground: 'fbbf24' },
        { token: 'attribute.value',           foreground: '4ade80' },
        // Decorators
        { token: 'meta.decorator',            foreground: 'a78bfa' },
        // Regex
        { token: 'regexp',                    foreground: 'fb923c' },
        // Imports
        { token: 'meta.import',               foreground: 'e2e2da' },
        // Errors
        { token: 'invalid',                   foreground: 'f87171', fontStyle: 'underline' },
        // Python-specific
        { token: 'keyword.python',            foreground: '60a5fa', fontStyle: 'bold' },
        // JS-specific
        { token: 'identifier.js',             foreground: 'e2e2da' },
      ],
      colors: {
        'editor.background':                   '#0a0a09',
        'editor.foreground':                   '#e2e2da',
        'editorLineNumber.foreground':         '#2a2a27',
        'editorLineNumber.activeForeground':   '#4ade80',
        'editor.lineHighlightBackground':      '#0f0f0e',
        'editor.lineHighlightBorder':          '#1a1a18',
        'editor.selectionBackground':          '#4ade8022',
        'editor.selectionHighlightBackground': '#4ade8011',
        'editor.inactiveSelectionBackground':  '#4ade8011',
        'editor.wordHighlightBackground':      '#60a5fa15',
        'editor.wordHighlightStrongBackground':'#4ade8020',
        'editor.findMatchBackground':          '#fbbf2440',
        'editor.findMatchHighlightBackground': '#fbbf2420',
        'editor.findMatchBorder':              '#fbbf2480',
        'editorCursor.foreground':             '#4ade80',
        'editorCursor.background':             '#0a0a09',
        'editorWhitespace.foreground':         '#1f1f1d',
        'editorIndentGuide.background1':        '#1a1a18',
        'editorIndentGuide.activeBackground1':  '#2a2a27',
        'editorBracketMatch.background':       '#4ade8018',
        'editorBracketMatch.border':           '#4ade8055',
        'editorBracketHighlight.foreground1':  '#4ade80',
        'editorBracketHighlight.foreground2':  '#60a5fa',
        'editorBracketHighlight.foreground3':  '#a78bfa',
        'editorBracketHighlight.foreground4':  '#fb923c',
        'editorBracketHighlight.unexpectedBracket.foreground': '#f87171',
        'editorGutter.background':             '#0a0a09',
        'editorGutter.modifiedBackground':     '#fbbf24',
        'editorGutter.addedBackground':        '#4ade80',
        'editorGutter.deletedBackground':      '#f87171',
        'scrollbar.shadow':                    '#00000000',
        'scrollbarSlider.background':          '#2a2a2740',
        'scrollbarSlider.hoverBackground':     '#2a2a2780',
        'scrollbarSlider.activeBackground':    '#4ade8030',
        'editorOverviewRuler.border':          '#00000000',
        'editorOverviewRuler.findMatchForeground': '#fbbf24',
        'editorOverviewRuler.errorForeground': '#f87171',
        'editorOverviewRuler.warningForeground': '#fbbf24',
        'editorOverviewRuler.modifiedForeground': '#4ade80',
        'editorWidget.background':             '#111110',
        'editorWidget.border':                 '#1f1f1d',
        'editorWidget.resizeBorder':           '#4ade80',
        'editorSuggestWidget.background':      '#111110',
        'editorSuggestWidget.border':          '#1f1f1d',
        'editorSuggestWidget.foreground':      '#e2e2da',
        'editorSuggestWidget.focusHighlightForeground': '#4ade80',
        'editorSuggestWidget.highlightForeground': '#4ade80',
        'editorSuggestWidget.selectedBackground': '#1f1f1d',
        'editorSuggestWidget.selectedForeground': '#ffffff',
        'editorSuggestWidget.selectedIconForeground': '#4ade80',
        'editorHoverWidget.background':        '#111110',
        'editorHoverWidget.border':            '#1f1f1d',
        'editorHoverWidget.foreground':        '#e2e2da',
        'editorHoverWidget.highlightForeground': '#4ade80',
        'editorHint.foreground':               '#4ade80',
        'editorHint.border':                   '#1f1f1d',
        'editorError.foreground':              '#f87171',
        'editorWarning.foreground':            '#fbbf24',
        'editorInfo.foreground':               '#60a5fa',
        'editorInlayHint.background':          '#1a1a1880',
        'editorInlayHint.foreground':          '#4a4a47',
        'editorInlayHint.typeForeground':      '#4ade8099',
        'editorInlayHint.parameterForeground': '#60a5fa99',
        'editorStickyScroll.background':       '#0d0d0c',
        'editorStickyScrollHover.background':  '#111110',
        'input.background':                    '#0f0f0e',
        'input.border':                        '#1f1f1d',
        'input.foreground':                    '#e2e2da',
        'input.placeholderForeground':         '#4a4a47',
        'list.hoverBackground':                '#171716',
        'list.activeSelectionBackground':      '#1f1f1d',
        'list.activeSelectionForeground':      '#4ade80',
        'list.focusHighlightForeground':       '#4ade80',
        'list.highlightForeground':            '#4ade80',
        'peekView.border':                     '#4ade8055',
        'peekViewEditor.background':           '#0d0d0c',
        'peekViewEditor.matchHighlightBackground': '#4ade8025',
        'peekViewResult.background':           '#111110',
        'peekViewResult.matchHighlightBackground': '#4ade8025',
        'peekViewResult.selectionBackground':  '#1f1f1d',
        'peekViewTitle.background':            '#111110',
        'peekViewTitleLabel.foreground':       '#e2e2da',
        'peekViewTitleDescription.foreground': '#9a9a98',
      },
    });
  });
}

ensureTheme();

// ─── Component ────────────────────────────────────────────────────────────────
export default function CodeEditor({
  value, onChange, language,
  readOnly = false,
  remoteCursors = {},
  onCursorPositionChange,
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationIds = useRef([]);

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.revealLine(1);

    editor.onDidChangeCursorPosition((e) => {
      if (onCursorPositionChange) {
        onCursorPositionChange({
          line: e.position.lineNumber,
          column: e.position.column,
        });
      }
    });
  };

  // Apply remote cursor decorations whenever remoteCursors changes
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const newDecorations = Object.entries(remoteCursors).map(([uid, { line, column }]) => ({
      range: new monaco.Range(line, column, line, column + 1),
      options: { className: `remote-cursor-${uid}` },
    }));

    decorationIds.current = editor.deltaDecorations(decorationIds.current, newDecorations);

    // Inject per-cursor CSS (colored left-border blinking cursor bar)
    const styleId = 'remote-cursors-css';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = Object.entries(remoteCursors).map(([uid, { color }]) => `
      .remote-cursor-${uid} {
        border-left: 2px solid ${color} !important;
        margin-left: -1px;
        animation: remote-cursor-blink 1s step-end infinite;
      }
    `).join('\n') + `
      @keyframes remote-cursor-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
    `;
  }, [remoteCursors]);

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme="codecollab-dark"
      onMount={handleMount}
      options={{
        fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", "Courier New", monospace',
        fontLigatures: true,
        fontSize: 13.5,
        lineHeight: 22,
        letterSpacing: 0.3,
        padding: { top: 16, bottom: 16 },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: 'off',
        lineNumbers: 'on',
        lineNumbersMinChars: 3,
        lineDecorationsWidth: 8,
        cursorStyle: 'line',
        cursorWidth: 2,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
          useShadows: false,
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
          arrowSize: 0,
        },
        minimap: { enabled: false },
        renderLineHighlight: 'all',
        renderWhitespace: 'none',
        guides: {
          bracketPairs: true,
          bracketPairsHorizontal: 'active',
          highlightActiveBracketPair: true,
          indentation: true,
          highlightActiveIndentation: true,
        },
        'bracketPairColorization.enabled': true,
        'bracketPairColorization.independentColorPoolPerBracketType': true,
        quickSuggestions: { other: true, comments: false, strings: false },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'smart',
        tabCompletion: 'on',
        suggest: {
          showKeywords: true,
          showSnippets: true,
          showIcons: true,
          showStatusBar: true,
          preview: true,
          previewMode: 'prefix',
          filterGraceful: true,
          insertMode: 'insert',
        },
        folding: true,
        foldingHighlight: true,
        showFoldingControls: 'mouseover',
        foldingStrategy: 'indentation',
        stickyScroll: { enabled: true, maxLineCount: 3 },
        selectionHighlight: true,
        occurrencesHighlight: 'singleFile',
        roundedSelection: true,
        overviewRulerBorder: false,
        overviewRulerLanes: 2,
        hideCursorInOverviewRuler: true,
        smoothScrolling: true,
        mouseWheelZoom: false,
        readOnly: readOnly,
        contextmenu: true,
        multiCursorModifier: 'alt',
        columnSelection: false,
        formatOnPaste: true,
        formatOnType: false,
        autoClosingBrackets: 'languageDefined',
        autoClosingQuotes: 'languageDefined',
        autoSurround: 'languageDefined',
        matchBrackets: 'always',
        glyphMargin: false,
      }}
    />
  );
}
