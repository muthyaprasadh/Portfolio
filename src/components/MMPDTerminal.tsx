import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft } from 'lucide-react';
import { playKeyBlip, playTapeClick } from '@/lib/sound';

interface HistoryItem {
  cmd: string;
  output: string | React.ReactNode;
}

export const MMPDTerminal = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      cmd: 'init',
      output: (
        <div>
          <div className="text-red-500 font-bold mb-1">
            [MIAMI METRO PD // FORENSIC DATABASE ACCESS v2.4]
          </div>
          <div className="text-muted-foreground text-xs">
            Classified candidate system initialized. Type <span className="text-red-400 font-bold">help</span> or click quick actions below.
          </div>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [history, open, minimized]);

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    playKeyBlip();

    let output: React.ReactNode = '';

    switch (cmd) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs">
            <p className="text-red-400 font-semibold">AVAILABLE EVIDENCE COMMANDS:</p>
            <p><b className="text-white">whoami</b> — Candidate identification & background</p>
            <p><b className="text-white">skills</b> — Technical toolkit & engineering competencies</p>
            <p><b className="text-white">projects</b> — Key forensic software architectures</p>
            <p><b className="text-white">contact</b> — Direct transmission channels</p>
            <p><b className="text-white">quote</b> — Intercept dark passenger monologue</p>
            <p><b className="text-white">clear</b> — Purge terminal log</p>
            <p><b className="text-white">exit</b> — Close forensic terminal</p>
          </div>
        );
        break;

      case 'whoami':
      case 'bio':
        output = (
          <div className="text-xs space-y-1">
            <p className="text-red-400 font-bold">SUBJECT: Muthya Prasadh Kommuru</p>
            <p>ROLE: Aspiring Software Engineer & Backend Developer</p>
            <p>EDUCATION: B.Tech CSE · SRM University-AP (2023 — 2027)</p>
            <p>LOCATION: Andhra Pradesh, India</p>
            <p className="text-muted-foreground">"Blending Code with Creativity — Building secure systems and intelligent digital solutions."</p>
          </div>
        );
        break;

      case 'skills':
      case 'stack':
        output = (
          <div className="text-xs space-y-1">
            <p className="text-red-400 font-bold">FORENSIC TOOLKIT:</p>
            <p><span className="text-white">Languages:</span> Java 21, Python, TypeScript, JavaScript, SQL, C/C++</p>
            <p><span className="text-white">Backend:</span> Spring Boot, Spring Security, JPA/Hibernate, Node.js, Express, REST APIs</p>
            <p><span className="text-white">Cloud/DevOps:</span> AWS (Lambda, API Gateway, DynamoDB, S3), Docker, Git</p>
            <p><span className="text-white">AI/Security:</span> PyTorch, Scikit-learn, Computer Vision, Wireshark, JWT Auth</p>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="text-xs space-y-2">
            <p className="text-red-400 font-bold">PRIMARY EVIDENCE ARCHIVES:</p>
            <div>
              <p className="text-white font-semibold">01. PayFlow — Enterprise Payment Gateway</p>
              <p className="text-muted-foreground">Java 21, Spring Boot, Spring Security, JWT, MySQL</p>
            </div>
            <div>
              <p className="text-white font-semibold">02. HelpHub — Community Assistance Platform</p>
              <p className="text-muted-foreground">React, Node.js, Express, MongoDB, WebSockets</p>
            </div>
            <div>
              <p className="text-white font-semibold">03. Smart Farmer Advisory System</p>
              <p className="text-muted-foreground">AWS Lambda, DynamoDB, Rekognition, SNS, Polly</p>
            </div>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="text-xs space-y-1">
            <p className="text-red-400 font-bold">DISPATCH CHANNELS:</p>
            <p>EMAIL: <a href="mailto:muthyakommuru698@gmail.com" className="text-white underline">muthyakommuru698@gmail.com</a></p>
            <p>LINKEDIN: <a href="https://www.linkedin.com/in/kommuru-muthya-prasadh-292351306/" target="_blank" rel="noreferrer" className="text-white underline">linkedin.com/in/kommuru-muthya-prasadh</a></p>
            <p>GITHUB: <a href="https://github.com/muthyaprasadh" target="_blank" rel="noreferrer" className="text-white underline">github.com/muthyaprasadh</a></p>
          </div>
        );
        break;

      case 'quote':
        output = (
          <div className="text-xs italic text-red-300">
            "Blood never lies. It's the physical evidence of what truly happened."
            <br />
            <span className="not-italic text-muted-foreground">— Dexter Morgan</span>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
      case 'close':
        setOpen(false);
        setInput('');
        return;

      default:
        output = (
          <span className="text-red-400 text-xs">
            Unknown command: "{rawCmd}". Type <span className="font-bold underline cursor-pointer" onClick={() => executeCommand('help')}>help</span> for options.
          </span>
        );
    }

    setHistory((prev) => [...prev, { cmd: rawCmd, output }]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      executeCommand(input);
    }
  };

  return (
    <>
      {/* Floating Trigger Badge */}
      {!open && (
        <button
          className="mmpd-trigger-btn"
          onClick={() => {
            playTapeClick();
            setOpen(true);
            setMinimized(false);
          }}
          aria-label="Open Miami Metro PD Forensic Database"
          title="Open Miami Metro PD Forensic Database"
        >
          <span className="live-dot" />
          <TerminalIcon size={14} className="text-red-500" />
          <span>MMPD EVIDENCE DB</span>
        </button>
      )}

      {/* Terminal Drawer Window */}
      {open && (
        <div className={`mmpd-terminal-window ${minimized ? 'minimized' : ''}`}>
          {/* Title Bar */}
          <div className="terminal-titlebar">
            <div className="title-left">
              <span className="live-dot" />
              <strong>MIAMI METRO PD // FORENSIC TERMINAL</strong>
            </div>
            <div className="title-actions">
              <button
                onClick={() => setMinimized(!minimized)}
                className="term-btn"
                title={minimized ? 'Maximize' : 'Minimize'}
                aria-label={minimized ? 'Maximize' : 'Minimize'}
              >
                {minimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
              </button>
              <button
                onClick={() => {
                  playTapeClick();
                  setOpen(false);
                }}
                className="term-btn close"
                title="Close"
                aria-label="Close"
              >
                <X size={12} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Terminal Logs */}
              <div className="terminal-body font-mono">
                {history.map((h, i) => (
                  <div key={i} className="terminal-entry mb-2">
                    {h.cmd !== 'init' && (
                      <div className="terminal-cmd-line flex items-center gap-2 text-red-500 text-xs mb-1">
                        <span>mmpd@dexter:~$</span>
                        <span className="text-white">{h.cmd}</span>
                      </div>
                    )}
                    <div className="terminal-output pl-2 border-l border-red-900/40">
                      {h.output}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Quick Action Pills */}
              <div className="terminal-shortcuts">
                <span>QUICK:</span>
                {['whoami', 'skills', 'projects', 'contact', 'quote', 'clear'].map((c) => (
                  <button
                    key={c}
                    className="term-pill"
                    onClick={() => executeCommand(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Command Input Prompt */}
              <div className="terminal-input-bar">
                <span className="prompt-label">mmpd@dexter:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type command (e.g. whoami, skills, projects)..."
                  className="terminal-input"
                  autoFocus
                />
                <button
                  className="terminal-enter-btn"
                  onClick={() => input.trim() && executeCommand(input)}
                  title="Run command"
                  aria-label="Run command"
                >
                  <CornerDownLeft size={13} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
