import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Github,
  Linkedin,
  ChevronDown,
  Mail,
  MapPin,
  ArrowUpRight,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Code2,
  GraduationCap,
  Fingerprint,
  Volume2,
  VolumeX,
  FileText
} from 'lucide-react';
import { ForensicCursor } from '@/components/ForensicCursor';
import { MMPDTerminal } from '@/components/MMPDTerminal';
import { ProjectModal } from '@/components/ProjectModal';
import { ContactDispatchForm } from '@/components/ContactDispatchForm';
import { GitHubSurveillance } from '@/components/GitHubSurveillance';
import { CinematicIntro } from '@/components/CinematicIntro';
import { FingerprintExperience } from '@/components/FingerprintExperience';
import { playTapeClick, playSlideTap, setSoundEnabled } from '@/lib/sound';

type Project = {
  title: string;
  type: string;
  description: string;
  tech: string[];
  status?: string;
  github?: string;
  demo?: string;
};

const projects: Project[] = [
  {
    title: 'PayFlow — Enterprise Payment Gateway',
    type: 'Backend',
    description:
      'A secure wallet and payment processing platform with authenticated APIs, transaction history, audit logging and fraud-aware workflows.',
    tech: ['Java 21', 'Spring Boot', 'Spring Security', 'JWT', 'JPA', 'MySQL'],
    status: 'FEATURED'
  },
  {
    title: 'HelpHub — Community Assistance',
    type: 'Fullstack',
    description:
      'A real-time community assistance platform connecting people to nearby help through task matching, role-based workflows and live communication.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'WebSockets'],
    github: 'https://github.com/muthyaprasadh/Help_Hub',
    status: 'FEATURED'
  },
  {
    title: 'Smart Farmer Advisory System',
    type: 'Backend',
    description:
      'A serverless agricultural advisory platform combining image-based crop insights with multilingual notifications and voice support.',
    tech: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Rekognition', 'SNS', 'Polly'],
    github: 'https://github.com/muthyaprasadh/AWS_farmer_advisory'
  },
  {
    title: 'ContiFood-961 Food Benchmark',
    type: 'AI / Research',
    description:
      'A fine-grained long-tailed food classification benchmark with 961 categories and a research exploration of attention-based visual learning.',
    tech: ['Python', 'PyTorch', 'ResNet-152', 'Computer Vision'],
    status: 'RESEARCH'
  },
  {
    title: 'Cross-Artifact Incident Reconstruction',
    type: 'Security',
    description:
      'An investigation workflow for correlating endpoint and network evidence into a unified incident timeline and relationship graph.',
    tech: ['Python', 'Wireshark', 'KAPE', 'SQLite', 'NetworkX'],
    github: 'https://github.com/muthyaprasadh/IncidentReconstruction',
    status: 'IN PROGRESS'
  },
  {
    title: 'Parkinson’s Severity Prediction',
    type: 'AI / Research',
    description:
      'A machine-learning application that estimates Motor and Total UPDRS scores using preprocessing, feature engineering and regression models.',
    tech: ['Python', 'Pandas', 'Scikit-learn', 'Streamlit']
  },
  {
    title: 'Obstacle Avoidance Robot',
    type: 'Hardware',
    description:
      'An autonomous robot that detects obstacles and navigates using ultrasonic sensing and embedded motor control.',
    tech: ['Arduino Uno', 'Embedded C', 'Ultrasonic Sensor', 'PWM']
  }
];

const skillGroups = [
  {
    name: 'Languages',
    items: ['Java', 'Python', 'C', 'C++', 'Kotlin', 'JavaScript', 'TypeScript', 'SQL']
  },
  {
    name: 'Frontend',
    items: ['React', 'HTML5', 'CSS3', 'Tailwind CSS', 'Jetpack Compose']
  },
  {
    name: 'Backend',
    items: ['Spring Boot', 'Spring Security', 'Node.js', 'Express.js', 'REST APIs', 'JWT', 'WebSockets']
  },
  {
    name: 'Databases',
    items: ['MySQL', 'MongoDB', 'DynamoDB']
  },
  {
    name: 'Cloud & DevOps',
    items: ['AWS Lambda', 'API Gateway', 'S3', 'Git', 'GitHub', 'Maven', 'Docker']
  },
  {
    name: 'AI / Security',
    items: ['PyTorch', 'Scikit-learn', 'Computer Vision', 'RAG', 'Wireshark', 'ZKPs']
  }
];

const filters = [
  'All',
  'Frontend',
  'Backend',
  'Fullstack',
  'AI / Research',
  'Security',
  'Hardware'
];

const dexterQuotes = [
  "Tonight's the night. And it's going to happen again and again.",
  "There are no secrets in life; just hidden truths that lie beneath the surface.",
  "I'm a very neat monster.",
  "Blood never lies. It's the physical evidence of what truly happened.",
  "Life doesn't have to be something that happens to us. It can be something we design.",
  "If you can't be good, be careful. That was Harry's code.",
  "People fake a lot of human interactions, but I feel like I fake them all, and I fake them very well.",
  "The only real question is: who are you when no one is watching?"
];

const Index = () => {
  const [filter, setFilter] = useState('All');
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [sound, setSound] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showForensicDatabase, setShowForensicDatabase] = useState(false);
  const closeForensicDatabase = useCallback(() => setShowForensicDatabase(false), []);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dexter-theme');
      if (saved) return saved === 'dark';
    }
    return true;
  });

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
    if (next) playTapeClick();
  };

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => {
        playTapeClick();
        return (prev + 1) % dexterQuotes.length;
      });
    }, 10000);
    return () => clearInterval(quoteInterval);
  }, []);

  useEffect(() => {
    localStorage.setItem('dexter-theme', dark ? 'dark' : 'light');
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.style.backgroundColor = '#090909';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.style.backgroundColor = '#f5f2eb';
    }
  }, [dark]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable);
      if (typing && event.key !== 'Escape') return;
      if (event.key.toLowerCase() === 't' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        window.dispatchEvent(new Event('dexter:toggle-terminal'));
      } else if (event.key.toLowerCase() === 'm' && !event.ctrlKey && !event.metaKey) {
        setDark((value) => !value);
      } else if (event.key.toLowerCase() === 's' && !event.ctrlKey && !event.metaKey) {
        setSound((value) => { setSoundEnabled(!value); if (!value) playTapeClick(); return !value; });
      } else if (event.key === 'Escape') {
        setSelectedProject(null);
        setShowShortcuts(false);
      } else if (event.key === '?') {
        setShowShortcuts((value) => !value);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const visible = useMemo(
    () =>
      projects.filter(
        (p) =>
          (filter === 'All' || p.type === filter) &&
          `${p.title} ${p.description} ${p.tech.join(' ')}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [filter, query]
  );

  const nav = [
    ['About', 'about'],
    ['Projects', 'projects'],
    ['Experience', 'experience'],
    ['Stack', 'stack'],
    ['Contact', 'contact']
  ];

  return (
    <main className={dark ? 'site dark' : 'site light'}>
      <CinematicIntro />
      <ForensicCursor />
      <MMPDTerminal />
      {showForensicDatabase && <FingerprintExperience onClose={closeForensicDatabase} />}
      <ProjectModal project={selectedProject ? { ...selectedProject, fileNo: `MP-${String(projects.indexOf(selectedProject) + 1).padStart(3, '0')}` } : null} onClose={() => setSelectedProject(null)} />
      {showShortcuts && (
        <div className="shortcuts-backdrop" role="dialog" aria-modal="true" aria-label="Investigator shortcuts" onClick={() => setShowShortcuts(false)}>
          <div className="shortcuts-panel" onClick={(event) => event.stopPropagation()}>
            <button className="shortcuts-close" onClick={() => setShowShortcuts(false)} aria-label="Close shortcuts">×</button>
            <span className="eyebrow">MIAMI METRO PD // OPERATOR MANUAL</span>
            <h2>Investigator <em>hotkeys.</em></h2>
            <div><kbd>T</kbd><span>Toggle forensic terminal</span></div>
            <div><kbd>M</kbd><span>Toggle dark / light mode</span></div>
            <div><kbd>S</kbd><span>Toggle forensic sound</span></div>
            <div><kbd>ESC</kbd><span>Close modal / overlay / drawer</span></div>
            <div><kbd>?</kbd><span>Show / hide this guide</span></div>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <header className="topbar">
        <a href="#home" className="wordmark">
          MP<span>.</span>
        </a>

        <nav className="desktop-nav">
          {nav.map(([n, id]) => (
            <a key={id} href={`#${id}`}>
              {n}
            </a>
          ))}
        </nav>

        <div className="top-actions">
          <button
            className={`icon-btn sound-toggle-btn ${sound ? 'active' : ''}`}
            aria-label={sound ? "Mute Forensic Audio" : "Enable Forensic Audio"}
            title={sound ? "Mute Forensic Audio (Active)" : "Enable Forensic Audio"}
            onClick={toggleSound}
          >
            {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          <button
            className="icon-btn theme-toggle-btn"
            aria-label="Toggle theme"
            title={dark ? "Switch to Forensic Light Mode" : "Switch to Noir Dark Mode"}
            onClick={() => setDark((d) => !d)}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            className="icon-btn mobile-menu"
            onClick={() => setMenu((m) => !m)}
            aria-label="Menu"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>

        {menu && (
          <nav className="mobile-nav">
            {nav.map(([n, id]) => (
              <a
                key={id}
                onClick={() => setMenu(false)}
                href={`#${id}`}
              >
                {n}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* HERO */}
      <section className="hero wrap" id="home">
        <div className="hero-kicker">
          <span className="live-dot" />
          AVAILABLE FOR INTERNSHIPS & ENGINEERING ROLES
          <span className="hero-index">CASE FILE / MP-001</span>
        </div>

        <div className="hero-grid">
          <div>
            <p className="overline">THE PORTFOLIO OF</p>

            <h1>
              MUTHYA
              <br />
              <em>PRASADH</em>
              <span className="period">.</span>
            </h1>

            <p className="hero-copy">
              I build software that solves real problems — from secure
              backend systems to intelligent applications.
            </p>

            <div className="hero-cta">
              <a className="primary-btn" href="#projects">
                Explore my work <ArrowUpRight size={16} />
              </a>

              <a
                className="resume-case-btn"
                href="/Muthya_Prasadh_Resume.pdf"
                download="Muthya_Prasadh_Resume.pdf"
                onClick={() => playTapeClick()}
                title="Download Confidential Forensic Dossier Resume (PDF)"
              >
                <FileText size={15} />
                <span>CASE FILE [PDF]</span>
                <span className="case-tag">SHA-256 ✓</span>
              </a>

              <a
                className="text-link"
                href="mailto:muthyakommuru698@gmail.com"
              >
                Get in touch <ArrowUpRight size={15} />
              </a>
            </div>

            <div className="hero-meta">
              <span>
                <MapPin size={14} /> Andhra Pradesh, India
              </span>
              <span>
                <GraduationCap size={15} /> CSE · SRM University-AP
              </span>
            </div>
          </div>

          {/* DEXTER DOSSIER WITH FAVICON REVEAL */}
          <div className="hero-art">
            <div className="file-stamp">
              CLASSIFIED
              <br />
              PERSONNEL FILE
            </div>

            <div className="dossier profile-dossier">
  <span className="dossier-label">SUBJECT / 001</span>

  <div className="profile-visual">

    {/* Original MP monogram */}
    <div className="dossier-monogram">
      M<span>.</span>P
    </div>

    {/* Hidden favicon */}
    <div className="favicon-reveal">
      <img src="/favicon.png" alt="Muthya Prasadh" />
      <div className="forensic-scan" />
    </div>

    {/* Police Line Do Not Cross / Do Not Hover Banner */}
    <div className="police-tape" aria-hidden="true">
      <div className="police-tape-content">
        <span className="police-tape-hazard" />
        POLICE LINE DO NOT CROSS • DO NOT HOVER
        <span className="police-tape-hazard" />
      </div>
    </div>

  </div>

  <div className="dossier-rule" />

  <p>
    SOFTWARE ENGINEER
    <br />
    IN TRAINING
  </p>

  <small>ACCESS LEVEL: PUBLIC</small>
</div>

            <div className="redaction redaction-one" />
            <div className="redaction redaction-two" />

            <div className="hero-coordinate">
              16°26' N
              <br />
              80°37' E
            </div>
          </div>
        </div>

        <div className="scroll-note">
          SCROLL TO INVESTIGATE <ChevronDown size={14} />
        </div>
      </section>

      {/* ABOUT */}
      <section className="section wrap" id="about">
        <div className="section-heading">
          <span className="eyebrow">01 / SUBJECT PROFILE</span>
          <h2>
            Behind the <em>code.</em>
          </h2>
        </div>

        <div className="about-grid">
          <div className="about-copy">
            <p className="lead">
              Curiosity is the starting point. Building is the answer.
            </p>

            <p>
              I'm a Computer Science and Engineering student at
              SRM University-AP, graduating in 2027. I enjoy turning
              complex ideas into practical software — especially
              backend engineering, cloud systems, AI and security.
            </p>

            <p>
              I've worked on production-oriented workflows during
              my software internship and built projects across
              payments, community platforms, machine learning
              and cloud-native applications.
            </p>

            <div className="about-tags">
              <span>Problem solving</span>
              <span>Backend engineering</span>
              <span>Cloud & AI</span>
              <span>Security mindset</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section projects-section" id="projects">
        <div className="wrap">
          <div className="section-heading">
            <span className="eyebrow">02 / EVIDENCE ARCHIVE</span>
            <h2>
              Selected <em>work.</em>
            </h2>
            <p>
              Projects, experiments and systems I've spent time building.
            </p>
          </div>

          <div className="project-toolbar">
            <div className="filter-row">
              {filters.map((f, i) => (
                <button
                  className={filter === f ? 'filter folder-tab active' : 'filter folder-tab'}
                  key={f}
                  onClick={() => {
                    playSlideTap();
                    setFilter(f);
                  }}
                >
                  <span className="tab-idx">0{i + 1}</span>
                  <span>{f}</span>
                </button>
              ))}
            </div>

            <label className="search-box">
              <Search size={15} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects"
              />
            </label>
          </div>

          <div className="project-grid">
            {visible.map((p, i) => (
              <article
                className={`project-card ${p.status === 'FEATURED' ? 'blood-slide-card' : ''}`}
                key={p.title}
                onMouseEnter={() => playSlideTap()}
                onClick={() => { playTapeClick(); setSelectedProject(p); }}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedProject(p); } }}
                role="button"
                tabIndex={0}
                aria-label={`Open case file for ${p.title}`}
              >
                {p.status === 'FEATURED' && (
                  <div className="blood-slide-header">
                    <span className="specimen-label">
                      <span className="specimen-dot" /> SPECIMEN SLIDE // 0{i + 1}
                    </span>
                    <span className="slide-glass-tag">BOROSILICATE GLASS</span>
                  </div>
                )}

                <div className="project-card-top">
                  <span>FILE NO. 0{i + 1}</span>
                  {p.status && <b>{p.status}</b>}
                </div>

                <div className="project-symbol">
                  {p.type === 'Security'
                    ? '⌁'
                    : p.type === 'AI / Research'
                    ? '◉'
                    : p.type === 'Hardware'
                    ? '⌘'
                    : '⌗'}
                </div>

                <h3>{p.title}</h3>
                <p>{p.description}</p>

                <div className="tech-list">
                  {p.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>

                <div className="project-bottom">
                  <span>{p.type.toUpperCase()}</span>

                  {p.github && p.github !== '#' ? (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                    >
                      SOURCE <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <span>DETAILS AVAILABLE ON REQUEST</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="section wrap" id="experience">
        <div className="section-heading">
          <span className="eyebrow">03 / FIELD RECORD</span>
          <h2>
            Experience & <em>education.</em>
          </h2>
        </div>

        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-date">
              MAY 2026 — JUL 2026
            </div>

            <div>
              <span className="eyebrow">
                SOFTWARE INTERN · HYDERABAD, INDIA
              </span>
              <h3>TechAeroes</h3>
              <p>
                Contributed features to an Andhra Pradesh Government
                tractor-rental platform, including role-based workflows,
                real-time availability, reservation management,
                admin dashboards and booking analytics.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">
              AUG 2023 — MAY 2027
            </div>

            <div>
              <span className="eyebrow">UNDERGRADUATE</span>
              <h3>SRM University-AP</h3>
              <p>
                Bachelor of Technology in Computer Science and Engineering.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">CERTIFICATIONS</div>

            <div>
              <span className="eyebrow">
                PROFESSIONAL CREDENTIALS
              </span>
              <h3>AWS & Oracle</h3>
              <p>
                AWS Certified Cloud Practitioner · Oracle Certified
                Professional: Java SE 17.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="section stack-section" id="stack">
        <div className="wrap">
          <div className="section-heading">
            <span className="eyebrow">04 / TOOLKIT</span>
            <h2>
              Tools of the <em>trade.</em>
            </h2>
          </div>

          <div className="skill-grid">
            {skillGroups.map((g) => (
              <div className="skill-group" key={g.name}>
                <h3>{g.name}</h3>

                <div>
                  {g.items.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <GitHubSurveillance />
          <div className="github-note">
            <Github size={19} />

            <div>
              <strong>Code lives on GitHub.</strong>
              <p>
                Explore repositories and experiments on my profile.
              </p>
            </div>

            <a
              href="https://github.com/muthyaprasadh"
              target="_blank"
              rel="noreferrer"
            >
              OPEN GITHUB <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="forensic-entry-cta">
            <button type="button" className="identify-yourself-btn" onClick={() => setShowForensicDatabase(true)}>
              <Fingerprint size={18} /> IDENTIFY YOURSELF
            </button>
          </div>
        </div>
      </section>

      {/* DEXTER FORENSIC MONOLOGUE / QUOTES */}
      <section className="dexter-quotes-section">
        <div className="wrap">
          <div className="dexter-quotes-card">
            <div className="dexter-quote-content">
              <p key={quoteIndex} className="dexter-quote-text">
                "{dexterQuotes[quoteIndex]}"
              </p>
              <cite className="dexter-quote-author">
                — Dexter Morgan, Blood Splatter Analyst
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div className="wrap contact-inner">
          <span className="eyebrow">05 / OPEN CHANNEL</span>

          <h2>
            Have a problem
            <br />
            worth <em>solving?</em>
          </h2>

          <p>
            I'm open to internships, engineering opportunities
            and interesting collaborations.
          </p>

          <ContactDispatchForm />

          <div className="contact-links">
            <a href="mailto:muthyakommuru698@gmail.com">
              <Mail size={16} /> EMAIL
            </a>

            <a
              href="https://www.linkedin.com/in/kommuru-muthya-prasadh-292351306/"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={16} /> LINKEDIN
            </a>

            <a
              href="https://github.com/muthyaprasadh"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={16} /> GITHUB
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer wrap">
        <a href="#home" className="wordmark">
          MP<span>.</span>
        </a>

        <span>
          © {new Date().getFullYear()} MUTHYA PRASADH KOMMURU
        </span>

        <span>
          BUILT WITH CURIOSITY <Code2 size={13} />
        </span>
      </footer>
    </main>
  );
};

export default Index;