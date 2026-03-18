import { Editor } from '@monaco-editor/react';

export default function CodeEditor({ value, onChange, language, readOnly = false }) {
    const handleEditorChange = (value) => {
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <Editor
            height="60vh"
            language={language}
            value={value}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: readOnly,
                automaticLayout: true,
            }}
        />
    );
}
