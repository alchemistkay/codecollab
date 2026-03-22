import { useState, useEffect, useCallback, useRef } from 'react';
import CodeEditor from './components/CodeEditor';
import OutputPanel from './components/OutputPanel';
import { sessionAPI } from './services/api';
import { useCollaboration } from './hooks/useCollaboration';
import { Play, Users, Copy, Check } from 'lucide-react';

const generateUserId = () => 'user_' + Math.random().toString(36).substr(2, 9);

function App() {
    const [sessionId, setSessionId] = useState(null);
    const userIdRef = useRef(generateUserId());
    const userId = userIdRef.current;
    const [code, setCode] = useState('print("Hello, CodeCollab!")');
    const [language, setLanguage] = useState('python');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [exitCode, setExitCode] = useState(null);
    const [duration, setDuration] = useState(null);
    const [executing, setExecuting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [executingUser, setExecutingUser] = useState(null);

    const handleCodeUpdate = useCallback((newCode) => {
        setCode(newCode);
    }, []);

    const handleExecutionResult = useCallback((result, fromUserId) => {
        setOutput(result.output || '');
        setError(result.error || '');
        setExitCode(result.exit_code);
        setDuration(result.duration_ms);
        setExecuting(false);
        setExecutingUser(null);
    }, []);

    const handleExecutionStarted = useCallback((fromUserId) => {
        setExecuting(true);
        setExecutingUser(fromUserId);
        setOutput('');
        setError('');
        setExitCode(null);
        setDuration(null);
    }, []);

    const { connected, users, sendCodeChange, executeCode } = useCollaboration(
        sessionId,
        userId,
        handleCodeUpdate,
        handleExecutionResult,
        handleExecutionStarted
    );

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlSessionId = urlParams.get('session');
        
        if (urlSessionId) {
            loadSession(urlSessionId);
        } else {
            createNewSession();
        }
    }, []);

    const loadSession = async (sessionId) => {
        try {
            const session = await sessionAPI.get(sessionId);
            setSessionId(session.id);
            setCode(session.code || 'print("Hello, CodeCollab!")');
            setLanguage(session.language);
            console.log('Joined session:', session.id);
        } catch (error) {
            console.error('Failed to load session:', error);
            createNewSession();
        }
    };

    const createNewSession = async () => {
        try {
            const session = await sessionAPI.create('Untitled Session', language);
            setSessionId(session.id);
            window.history.pushState({}, '', `?session=${session.id}`);
            console.log('Session created:', session.id);
        } catch (error) {
            console.error('Failed to create session:', error);
        }
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        if (connected) {
            sendCodeChange(newCode);
        }
    };

    const handleRunCode = () => {
        if (connected) {
            setExecuting(true);
            setExecutingUser(userId);
            executeCode(language, code);
        }
    };

    const copySessionLink = () => {
        const link = `${window.location.origin}?session=${sessionId}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4'
        }}>
            <header style={{
                padding: '12px 24px',
                backgroundColor: '#2d2d30',
                borderBottom: '1px solid #3e3e42',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ margin: 0, fontSize: '20px' }}>CodeCollab</h1>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {sessionId && (
                        <button
                            onClick={copySessionLink}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: copied ? '#1a472a' : '#3c3c3c',
                                color: '#d4d4d4',
                                border: '1px solid #3e3e42',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px'
                            }}
                        >
                            {copied ? (
                                <>
                                    <Check size={14} />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={14} />
                                    Share Link
                                </>
                            )}
                        </button>
                    )}

                    <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{
                            padding: '6px 12px',
                            backgroundColor: '#3c3c3c',
                            color: '#d4d4d4',
                            border: '1px solid #3e3e42',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                    </select>

                    <button
                        onClick={handleRunCode}
                        disabled={executing || !connected}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: executing || !connected ? '#3c3c3c' : '#0e639c',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: executing || !connected ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 'bold'
                        }}
                    >
                        <Play size={16} />
                        {executing ? (executingUser === userId ? 'Running...' : 'Running...') : 'Run Code'}
                    </button>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        backgroundColor: connected ? '#1a472a' : '#3c3c3c',
                        borderRadius: '4px'
                    }}>
                        <Users size={16} />
                        <span>{users.length} user{users.length !== 1 ? 's' : ''}</span>
                        {connected && (
                            <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#4ec9b0'
                            }} />
                        )}
                    </div>
                </div>
            </header>

            <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1px',
                backgroundColor: '#3e3e42',
                overflow: 'hidden'
            }}>
                <div style={{ backgroundColor: '#1e1e1e', padding: '16px' }}>
                    <h3 style={{ margin: '0 0 12px 0', color: '#4ec9b0' }}>Code Editor</h3>
                    <CodeEditor
                        value={code}
                        onChange={handleCodeChange}
                        language={language}
                    />
                </div>

                <div style={{ backgroundColor: '#1e1e1e', padding: '16px' }}>
                    <OutputPanel
                        output={output}
                        error={error}
                        exitCode={exitCode}
                        duration={duration}
                    />
                </div>
            </div>

            <footer style={{
                padding: '8px 24px',
                backgroundColor: '#007acc',
                color: '#fff',
                fontSize: '12px',
                textAlign: 'center'
            }}>
                Session: {sessionId || 'Loading...'} | User: {userId}
            </footer>
        </div>
    );
}

export default App;
