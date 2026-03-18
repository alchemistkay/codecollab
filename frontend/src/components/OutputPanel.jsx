export default function OutputPanel({ output, error, exitCode, duration }) {
    return (
        <div style={{
            height: '60vh',
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            padding: '16px',
            fontFamily: 'monospace',
            fontSize: '14px',
            overflow: 'auto',
            borderRadius: '4px'
        }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#4ec9b0' }}>Output</h3>
            
            {output && (
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ color: '#858585', marginBottom: '4px' }}>stdout:</div>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output}</pre>
                </div>
            )}
            
            {error && (
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ color: '#f48771', marginBottom: '4px' }}>stderr:</div>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#f48771' }}>{error}</pre>
                </div>
            )}
            
            {exitCode !== null && (
                <div style={{ marginTop: '12px', color: '#858585' }}>
                    Exit code: {exitCode}
                    {duration && ` | Duration: ${duration}ms`}
                </div>
            )}
            
            {!output && !error && (
                <div style={{ color: '#858585' }}>
                    No output yet. Click "Run Code" to execute.
                </div>
            )}
        </div>
    );
}
