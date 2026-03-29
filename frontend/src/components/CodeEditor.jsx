import { useEffect, useRef } from 'react';
import { Editor, loader } from '@monaco-editor/react';

// ─── Custom theme definition ──────────────────────────────────────────────────
// Defined once outside the component so it's only registered once.
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
        { token: 'constant.language',         foreground: '60a5fa' },  // true/false/None
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
        { token: 'variable.language',         foreground: '94a3b8' },  // this/self
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
        // Editor core
        'editor.background':                   '#0a0a09',
        'editor.foreground':                   '#e2e2da',

        // Line numbers
        'editorLineNumber.foreground':         '#2a2a27',
        'editorLineNumber.activeForeground':   '#4ade80',

        // Current line
        'editor.lineHighlightBackground':      '#0f0f0e',
        'editor.lineHighlightBorder':          '#1a1a18',

        // Selection
        'editor.selectionBackground':          '#4ade8022',
        'editor.selectionHighlightBackground': '#4ade8011',
        'editor.inactiveSelectionBackground':  '#4ade8011',
        'editor.wordHighlightBackground':      '#60a5fa15',
        'editor.wordHighlightStrongBackground':'#4ade8020',

        // Find/replace
        'editor.findMatchBackground':          '#fbbf2440',
        'editor.findMatchHighlightBackground': '#fbbf2420',
        'editor.findMatchBorder':              '#fbbf2480',

        // Cursor
        'editorCursor.foreground':             '#4ade80',
        'editorCursor.background':             '#0a0a09',

        // Whitespace & guides
        'editorWhitespace.foreground':         '#1f1f1d',
        'editorIndentGuide.background1':        '#1a1a18',
        'editorIndentGuide.activeBackground1':  '#2a2a27',

        // Bracket matching
        'editorBracketMatch.background':       '#4ade8018',
        'editorBracketMatch.border':           '#4ade8055',

        // Bracket pair colorization
        'editorBracketHighlight.foreground1':  '#4ade80',
        'editorBracketHighlight.foreground2':  '#60a5fa',
        'editorBracketHighlight.foreground3':  '#a78bfa',
        'editorBracketHighlight.foreground4':  '#fb923c',
        'editorBracketHighlight.unexpectedBracket.foreground': '#f87171',

        // Gutter
        'editorGutter.background':             '#0a0a09',
        'editorGutter.modifiedBackground':     '#fbbf24',
        'editorGutter.addedBackground':        '#4ade80',
        'editorGutter.deletedBackground':      '#f87171',

        // Scrollbar
        'scrollbar.shadow':                    '#00000000',
        'scrollbarSlider.background':          '#2a2a2740',
        'scrollbarSlider.hoverBackground':     '#2a2a2780',
        'scrollbarSlider.activeBackground':    '#4ade8030',

        // Overview ruler
        'editorOverviewRuler.border':          '#00000000',
        'editorOverviewRuler.findMatchForeground': '#fbbf24',
        'editorOverviewRuler.errorForeground': '#f87171',
        'editorOverviewRuler.warningForeground': '#fbbf24',
        'editorOverviewRuler.modifiedForeground': '#4ade80',

        // Widgets (autocomplete, hover)
        'editorWidget.background':             '#111110',
        'editorWidget.border':                 '#1f1f1d',
        'editorWidget.resizeBorder':           '#4ade80',

        // Suggest widget (autocomplete)
        'editorSuggestWidget.background':      '#111110',
        'editorSuggestWidget.border':          '#1f1f1d',
        'editorSuggestWidget.foreground':      '#e2e2da',
        'editorSuggestWidget.focusHighlightForeground': '#4ade80',
        'editorSuggestWidget.highlightForeground': '#4ade80',
        'editorSuggestWidget.selectedBackground': '#1f1f1d',
        'editorSuggestWidget.selectedForeground': '#ffffff',
        'editorSuggestWidget.selectedIconForeground': '#4ade80',

        // Hover widget
        'editorHoverWidget.background':        '#111110',
        'editorHoverWidget.border':            '#1f1f1d',
        'editorHoverWidget.foreground':        '#e2e2da',
        'editorHoverWidget.highlightForeground': '#4ade80',

        // Parameter hints
        'editorHint.foreground':               '#4ade80',
        'editorHint.border':                   '#1f1f1d',

        // Error / warning squiggles
        'editorError.foreground':              '#f87171',
        'editorWarning.foreground':            '#fbbf24',
        'editorInfo.foreground':               '#60a5fa',

        // Inlay hints
        'editorInlayHint.background':          '#1a1a1880',
        'editorInlayHint.foreground':          '#4a4a47',
        'editorInlayHint.typeForeground':      '#4ade8099',
        'editorInlayHint.parameterForeground': '#60a5fa99',

        // Sticky scroll
        'editorStickyScroll.background':       '#0d0d0c',
        'editorStickyScrollHover.background':  '#111110',

        // Input fields inside editor
        'input.background':                    '#0f0f0e',
        'input.border':                        '#1f1f1d',
        'input.foreground':                    '#e2e2da',
        'input.placeholderForeground':         '#4a4a47',

        // List (used in suggest/find)
        'list.hoverBackground':                '#171716',
        'list.activeSelectionBackground':      '#1f1f1d',
        'list.activeSelectionForeground':      '#4ade80',
        'list.focusHighlightForeground':       '#4ade80',
        'list.highlightForeground':            '#4ade80',

        // Peek view (go to definition)
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

// Register theme immediately on module load
ensureTheme();

// ─── Component ────────────────────────────────────────────────────────────────
export default function CodeEditor({ value, onChange, language, readOnly = false }) {
  const editorRef = useRef(null);

  const handleMount = (editor) => {
    editorRef.current = editor;
    // Smooth scroll to top when language changes
    editor.revealLine(1);
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme="codecollab-dark"
      onMount={handleMount}
      options={{
        // Font
        fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", "Courier New", monospace',
        fontLigatures: true,
        fontSize: 13.5,
        lineHeight: 22,
        letterSpacing: 0.3,

        // Layout
        padding: { top: 16, bottom: 16 },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: 'off',

        // Line numbers
        lineNumbers: 'on',
        lineNumbersMinChars: 3,
        lineDecorationsWidth: 8,

        // Cursor
        cursorStyle: 'line',
        cursorWidth: 2,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',

        // Scrollbar
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
          useShadows: false,
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
          arrowSize: 0,
        },

        // Minimap — off, saves space
        minimap: { enabled: false },

        // Guides & highlighting
        renderLineHighlight: 'all',
        renderWhitespace: 'none',
        guides: {
          bracketPairs: true,
          bracketPairsHorizontal: 'active',
          highlightActiveBracketPair: true,
          indentation: true,
          highlightActiveIndentation: true,
        },

        // Bracket colorization
        'bracketPairColorization.enabled': true,
        'bracketPairColorization.independentColorPoolPerBracketType': true,

        // Suggestions & intellisense
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

        // Code folding
        folding: true,
        foldingHighlight: true,
        showFoldingControls: 'mouseover',
        foldingStrategy: 'indentation',

        // Sticky scroll (shows function/class context at top)
        stickyScroll: { enabled: true, maxLineCount: 3 },

        // Selection & occurrences
        selectionHighlight: true,
        occurrencesHighlight: 'singleFile',
        roundedSelection: true,

        // Overview ruler
        overviewRulerBorder: false,
        overviewRulerLanes: 2,
        hideCursorInOverviewRuler: true,

        // Misc UX
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

        // Glyph margin (for breakpoints/icons)
        glyphMargin: false,
      }}
    />
  );
}
