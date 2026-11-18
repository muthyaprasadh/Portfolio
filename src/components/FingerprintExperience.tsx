import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Database,
  Fingerprint,
  LoaderCircle,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { FingerprintGenerator } from '@/components/FingerprintGenerator';
import {
  createFingerprintId,
  loadFingerprintRecords,
  saveFingerprintRecord,
  type FingerprintRecord,
} from '@/lib/forensicDatabase';

type FingerprintExperienceProps = {
  onClose: () => void;
};

type Stage = 'registration' | 'scanner' | 'reveal' | 'database';

const SCAN_DURATION = 5000;
const INITIAL_SEED = 'dexter-forensic-scanner';

const formatTimestamp = (value: string) => new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(value));

const containTabNavigation = (event: React.KeyboardEvent<HTMLElement>) => {
  if (event.key !== 'Tab') return;
  const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
    'a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])',
  ));
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const IdentityRegistration = ({
  onContinue,
  storageError,
}: {
  onContinue: (name: string) => void;
  storageError: string;
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const identity = name.trim();
    if (!identity) {
      setError('Enter a name to open an evidence file.');
      return;
    }
    setError('');
    onContinue(identity);
  };

  return (
    <div className="fp-registration">
      <div className="fp-section-marker"><span>01</span> SUBJECT INTAKE / IDENTITY REGISTRATION</div>
      <div className="fp-registration-copy">
        <Fingerprint className="fp-registration-icon" size={38} strokeWidth={1.2} />
        <span className="fp-eyebrow">MIAMI METRO FORENSIC LAB // INTAKE</span>
        <h1>IDENTIFY <em>YOURSELF</em></h1>
        <p>Every visitor leaves evidence.</p>
        <form onSubmit={submit} noValidate>
          <label htmlFor="fp-visitor-name">VISITOR NAME</label>
          <input
            id="fp-visitor-name"
            autoComplete="name"
            autoFocus
            maxLength={60}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError('');
            }}
            placeholder="Enter your name to begin"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'fp-name-error' : undefined}
          />
          {error && <span className="fp-error" id="fp-name-error" role="alert">{error}</span>}
          <button type="submit" className="fp-primary-button">
            REGISTER IDENTITY <ArrowUpRight size={16} />
          </button>
        </form>
        <span className="fp-privacy-note">
          <ShieldCheck size={14} /> SIMULATED ARTWORK ONLY // NO BIOMETRIC DATA COLLECTED
        </span>
        {storageError && <p className="fp-storage-error" role="status">{storageError}</p>}
      </div>
    </div>
  );
};

const FingerprintScanner = ({
  visitorName,
  onCapture,
}: {
  visitorName: string;
  onCapture: () => void;
}) => {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const scanningRef = useRef(false);
  const completedRef = useRef(false);
  const startTimeRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const circleCircumference = 2 * Math.PI * 135;

  const stopFrame = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const cancelScan = useCallback(() => {
    if (!scanningRef.current) return;
    scanningRef.current = false;
    stopFrame();
    setHolding(false);
    setProgress(0);
    setCancelled(true);
  }, [stopFrame]);

  const completeScan = useCallback(() => {
    if (!scanningRef.current || completedRef.current) return;
    scanningRef.current = false;
    completedRef.current = true;
    frameRef.current = null;
    setHolding(false);
    setProgress(1);
    setCaptured(true);
    setCancelled(false);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([35, 40, 90]);
    }
    onCapture();
  }, [onCapture]);

  const startScan = useCallback((event?: React.PointerEvent<HTMLButtonElement>) => {
    if (scanningRef.current || completedRef.current) return;
    event?.preventDefault();
    if (event) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    scanningRef.current = true;
    startTimeRef.current = performance.now();
    setHolding(true);
    setCancelled(false);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(18);
    }

    const updateProgress = (now: number) => {
      if (!scanningRef.current) return;
      const next = Math.min((now - startTimeRef.current) / SCAN_DURATION, 1);
      setProgress(next);
      if (next >= 1) {
        completeScan();
      } else {
        frameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    frameRef.current = requestAnimationFrame(updateProgress);
  }, [completeScan]);

  useEffect(() => () => {
    scanningRef.current = false;
    stopFrame();
  }, [stopFrame]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    event.preventDefault();
    if (!event.repeat) startScan();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((event.key === ' ' || event.key === 'Enter') && scanningRef.current) {
      event.preventDefault();
      cancelScan();
    }
  };

  return (
    <div className="fp-scanner-stage">
      <div className="fp-section-marker"><span>02</span> LIVE SCAN / SUBJECT: {visitorName.toUpperCase()}</div>
      <div className="fp-scan-layout">
        <div className="fp-scanner-copy">
          <span className="fp-eyebrow">SIMULATED PRINT CAPTURE</span>
          <h1>PLACE YOUR FINGER<br /><em>ON THE SCANNER</em></h1>
          <p>Hold steady while the optical array maps a unique piece of procedural artwork.</p>
          <div className="fp-instruction"><span className={holding ? 'fp-status-light active' : 'fp-status-light'} />HOLD TO CAPTURE YOUR PRINT</div>
          <span className="fp-scan-hint">5 SECONDS // RELEASE EARLY TO CANCEL</span>
        </div>

        <button
          type="button"
          className={`fp-scanner-button${holding ? ' is-scanning' : ''}${captured ? ' is-captured' : ''}`}
          autoFocus
          onPointerDown={startScan}
          onPointerUp={cancelScan}
          onPointerCancel={cancelScan}
          onLostPointerCapture={cancelScan}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onContextMenu={(event) => event.preventDefault()}
          disabled={captured}
          aria-label={captured ? 'Fingerprint captured' : 'Press and hold for five seconds to capture a simulated fingerprint'}
          aria-describedby="fp-scanner-instructions"
        >
          <svg className="fp-progress-ring" viewBox="0 0 300 300" aria-hidden="true">
            <circle className="fp-progress-track" cx="150" cy="150" r="135" />
            <circle
              className="fp-progress-value"
              cx="150"
              cy="150"
              r="135"
              strokeDasharray={circleCircumference}
              strokeDashoffset={circleCircumference * (1 - progress)}
            />
          </svg>
          <span className="fp-scanner-core">
            <FingerprintGenerator seed={INITIAL_SEED} size={220} scanProgress={progress} className="fp-scanner-print" />
            {holding && <span className="fp-scan-beam" aria-hidden="true" />}
            {holding && <span className="fp-scanner-particles" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>}
          </span>
          <span className="fp-scan-percent">{Math.floor(progress * 100)}<small>%</small></span>
        </button>

        <span className="fp-sr-only" id="fp-scanner-instructions">
          Press and hold the scanner with a pointer, or hold Space or Enter on the keyboard. Releasing early resets the scan.
        </span>
      </div>
      <div className={`fp-capture-status${captured ? ' is-visible' : ''}`} role="status" aria-live="polite">
        {captured ? (
          <>
            <strong>FINGERPRINT CAPTURED</strong>
            <span>IDENTITY VERIFIED</span>
            <span>EVIDENCE SUCCESSFULLY RECORDED</span>
          </>
        ) : cancelled ? (
          <span>SCAN INTERRUPTED // PROGRESS RESET</span>
        ) : (
          <span>{holding ? 'READING RIDGE PATTERN...' : 'SCANNER READY // AWAITING CONTACT'}</span>
        )}
      </div>
      <p className="fp-simulation-disclaimer">THIS IS A SIMULATED ARTISTIC PRINT. DEVICE BIOMETRICS ARE NOT ACCESSED.</p>
    </div>
  );
};

const FingerprintReveal = ({
  record,
  onViewDatabase,
  storageError,
}: {
  record: FingerprintRecord;
  onViewDatabase: () => void;
  storageError: string;
}) => (
  <div className="fp-reveal-stage">
    <span className="fp-section-marker"><span>03</span> VERIFIED / EVIDENCE FILE CREATED</span>
    <div className="fp-reveal-content">
      <div className="fp-reveal-print">
        <FingerprintGenerator seed={record.seed} size={300} />
        <span className="fp-reveal-seal"><ShieldCheck size={18} /> VERIFIED</span>
      </div>
      <div className="fp-reveal-details">
        <span className="fp-eyebrow">EVIDENCE SUCCESSFULLY RECORDED</span>
        <h1>YOUR PRINT IS NOW<br /><em>IN THE DATABASE</em></h1>
        <div className="fp-evidence-fields">
          <div><span>VISITOR</span><strong>{record.name}</strong></div>
          <div><span>FINGERPRINT ID</span><strong>{record.id}</strong></div>
          <div><span>CAPTURED</span><strong>{formatTimestamp(record.capturedAt)}</strong></div>
        </div>
        <p className="fp-simulation-disclaimer">SIMULATED ARTWORK ONLY // NO BIOMETRIC DATA STORED</p>
        {storageError && <p className="fp-storage-error" role="status">{storageError}</p>}
        <button type="button" className="fp-primary-button" onClick={onViewDatabase} autoFocus>
          <Database size={16} /> VIEW FORENSIC DATABASE
        </button>
      </div>
    </div>
  </div>
);

const hashPosition = (value: string, suffix: string) => {
  let hash = 0;
  const input = `${value}:${suffix}`;
  for (let index = 0; index < input.length; index += 1) {
    hash = (Math.imul(hash, 31) + input.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
};

const ForensicDatabase = ({
  records,
  onBack,
  onClose,
}: {
  records: FingerprintRecord[];
  onBack: () => void;
  onClose: () => void;
}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<FingerprintRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const pointerOrigin = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 550);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredRecords = useMemo(() => records
    .filter((record) => record.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => b.capturedAt.localeCompare(a.capturedAt)), [records, search]);
  const columns = Math.ceil(Math.sqrt(filteredRecords.length * 1.5));
  const rows = Math.ceil(filteredRecords.length / Math.max(columns, 1));

  const startPan = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button, input')) return;
    pointerOrigin.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const pan = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerOrigin.current) return;
    setOffset({
      x: pointerOrigin.current.offsetX + event.clientX - pointerOrigin.current.x,
      y: pointerOrigin.current.offsetY + event.clientY - pointerOrigin.current.y,
    });
  };

  const stopPan = () => {
    pointerOrigin.current = null;
  };

  const changeZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setZoom((current) => Math.min(1.7, Math.max(0.55, current - event.deltaY * 0.001)));
  };

  return (
    <div className="fp-database-wall" role="dialog" aria-modal="true" aria-label="Forensic fingerprint database" onKeyDown={containTabNavigation}>
      <header className="fp-wall-header">
        <button type="button" className="fp-wall-back" onClick={onBack}><ArrowLeft size={16} /> EVIDENCE FILE</button>
        <div className="fp-wall-title"><span className="fp-eyebrow">FORENSIC ARCHIVE / LOCAL PROTOTYPE</span><h2>FINGERPRINT <em>DATABASE</em></h2></div>
        <button type="button" className="fp-icon-close" onClick={onClose} aria-label="Close forensic database"><X size={20} /></button>
      </header>
      <div className="fp-wall-tools">
        <div className="fp-wall-count">        <strong>{records.length}</strong><span>REGISTERED PRINTS</span></div>
        <label className="fp-wall-search">
          <Search size={16} />
          <input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search visitor name" aria-label="Search visitor name" />
        </label>
        <div className="fp-zoom-controls">
          <button type="button" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(0.55, value - 0.1))}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(1.7, value + 0.1))}>+</button>
        </div>
      </div>
      <div
        className="fp-wall-viewport"
        ref={canvasRef}
        onPointerDown={startPan}
        onPointerMove={pan}
        onPointerUp={stopPan}
        onPointerCancel={stopPan}
        onLostPointerCapture={stopPan}
        onWheel={changeZoom}
      >
        {loading ? (
          <div className="fp-wall-loading"><LoaderCircle size={30} /><span>INDEXING EVIDENCE...</span></div>
        ) : filteredRecords.length === 0 ? (
          <div className="fp-wall-empty">
            <Fingerprint size={38} />
            <span>{search ? 'NO MATCHING PRINTS' : 'NO PRINTS IN THIS LOCAL ARCHIVE YET'}</span>
          </div>
        ) : (
          <div
            className="fp-wall-canvas"
            style={{ transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})` }}
          >
            {filteredRecords.map((record, index) => {
              const column = index % columns;
              const row = Math.floor(index / columns);
              const x = (columns === 1 ? 50 : 12 + column * (76 / (columns - 1)))
                + (hashPosition(record.id, 'x') % 5) - 2;
              const y = (rows === 1 ? 50 : 12 + row * (76 / (rows - 1)))
                + (hashPosition(record.id, 'y') % 5) - 2;
              const tilt = (hashPosition(record.id, 'tilt') % 25) - 12;
              return (
                <button
                  type="button"
                  className={`fp-wall-print${selected?.id === record.id ? ' selected' : ''}`}
                  key={record.id}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) rotate(${tilt}deg)`,
                    zIndex: selected?.id === record.id ? 2 : 1,
                  }}
                  onClick={() => setSelected(record)}
                  aria-label={`View print ${index + 1} from ${record.name}`}
                >
                  <FingerprintGenerator seed={record.seed} size={132} />
                  <span>{record.id}</span>
                </button>
              );
            })}
          </div>
        )}
        {selected && (
          <aside className="fp-wall-detail">
            <button type="button" className="fp-wall-detail-close" aria-label="Close print details" onClick={() => setSelected(null)}><X size={15} /></button>
            <FingerprintGenerator seed={selected.seed} size={92} />
            <div><strong>{selected.name}</strong><span>{selected.id}</span><small>{formatTimestamp(selected.capturedAt)}</small></div>
          </aside>
        )}
        <span className="fp-wall-pan-hint">DRAG TO MOVE // SCROLL OR +/- TO ZOOM</span>
      </div>
      <footer className="fp-wall-footer">
        <span><ShieldCheck size={13} /> SIMULATED PRINTS // STORED IN THIS BROWSER ONLY</span>
        <button type="button" onClick={onBack}>RETURN TO YOUR PRINT <ArrowUpRight size={14} /></button>
      </footer>
    </div>
  );
};

export const FingerprintExperience = ({ onClose }: FingerprintExperienceProps) => {
  const [stage, setStage] = useState<Stage>('registration');
  const [visitorName, setVisitorName] = useState('');
  const [record, setRecord] = useState<FingerprintRecord | null>(null);
  const [records, setRecords] = useState<FingerprintRecord[]>([]);
  const [storageError, setStorageError] = useState('');
  const capturedTimer = useRef<number | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);

    try {
      setRecords(loadFingerprintRecords());
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : 'Unable to open the local forensic archive.');
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
      if (capturedTimer.current !== null) window.clearTimeout(capturedTimer.current);
    };
  }, [onClose]);

  const saveCapture = useCallback(() => {
    const id = createFingerprintId();
    const newRecord: FingerprintRecord = {
      id,
      name: visitorName,
      capturedAt: new Date().toISOString(),
      seed: id,
    };
    setRecord(newRecord);
    try {
      setRecords(saveFingerprintRecord(newRecord));
      setStorageError('');
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : 'Unable to save this simulated print locally.');
    }
    capturedTimer.current = window.setTimeout(() => setStage('reveal'), 1450);
  }, [visitorName]);

  if (stage === 'database') {
    return (
      <ForensicDatabase
        records={records}
        onBack={() => setStage('reveal')}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fp-experience" role="dialog" aria-modal="true" aria-label="Forensic fingerprint scanner" onKeyDown={containTabNavigation}>
      <div className="fp-film-grain" aria-hidden="true" />
      <header className="fp-experience-header">
        <a href="#home" className="fp-lab-mark" onClick={(event) => { event.preventDefault(); onClose(); }}>MP<span>.</span></a>
        <span className="fp-header-status"><i /> MIAMI METRO FORENSIC LAB</span>
        <button type="button" className="fp-icon-close" onClick={onClose} aria-label="Close forensic scanner"><X size={20} /></button>
      </header>
      {stage === 'registration' && (
        <IdentityRegistration
          onContinue={(name) => {
            setVisitorName(name);
            setStage('scanner');
          }}
          storageError={storageError}
        />
      )}
      {stage === 'scanner' && (
        <FingerprintScanner
          visitorName={visitorName}
          onCapture={saveCapture}
        />
      )}
      {stage === 'reveal' && record && (
        <FingerprintReveal
          record={record}
          onViewDatabase={() => setStage('database')}
          storageError={storageError}
        />
      )}
      <footer className="fp-experience-footer">
        <span>SIMULATED PROCEDURAL ART // NO BIOMETRIC DATA</span>
        <span>{stage === 'registration' ? '01 / 03' : stage === 'scanner' ? '02 / 03' : '03 / 03'}</span>
      </footer>
    </div>
  );
};
