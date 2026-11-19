import { useMemo, useState, useEffect } from 'react';
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
  Volume2,
  VolumeX,
  FileText
} from 'lucide-react';
import { ForensicCursor } from '@/components/ForensicCursor';
import { MMPDTerminal } from '@/components/MMPDTerminal';
import { ProjectModal } from '@/components/ProjectModal';
import { ContactDispatchForm } from '@/components/ContactDispatchForm';
import { SkillArsenal } from '@/components/SkillArsenal';
import { ResearchPublications } from '@/components/ResearchPublications';
import { CinematicIntro } from '@/components/CinematicIntro';
import { projects, type Project } from '@/lib/projects';
import { playTapeClick, playSlideTap, setSoundEnabled } from '@/lib/sound';

const filters = [
  'All',
  'Fullstack',
  'AI',
  'Research',
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
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * dexterQuotes.length));
  const [sound, setSound] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
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
  const displayedProjects = showAllProjects ? visible : visible.slice(0, 3);

  const nav = [
    ['About', 'about'],
    ['Projects', 'projects'],
    ['Research', 'research'],
    ['Experience', 'experience'],
    ['Stack', 'stack'],
    ['Contact', 'contact']
  ];

  return (
    <main className={dark ? 'site dark' : 'site light'}>
      <CinematicIntro />
      <ForensicCursor />
      <MMPDTerminal />
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

            <p className="hero-role">
              ASPIRING SOFTWARE ENGINEER <span>BACKEND · AI · CLOUD · CYBERSECURITY</span>
            </p>

            <p className="hero-copy">
              I build software that solves real problems from secure
              backend systems to intelligent applications.
            </p>

            <div className="hero-cta">
              <a className="primary-btn" href="#projects">
                View Projects <ArrowUpRight size={16} />
              </a>

              <a
                className="resume-case-btn hero-resume-btn"
                href="/Muthya_Prasadh_Resume.pdf"
                download="Muthya_Prasadh_Resume.pdf"
                onClick={() => playTapeClick()}
                title="Download resume PDF"
              >
                <FileText size={15} />
                <span>Download Resume</span>
                <span className="case-tag">PDF</span>
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
              complex ideas into practical software especially
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
              {filters.map((f) => (
                <button
                  className={filter === f ? 'filter folder-tab active' : 'filter folder-tab'}
                  key={f}
                  onClick={() => {
                    playSlideTap();
                    setFilter(f);
                    setShowAllProjects(false);
                  }}
                >
                  <span>{f}</span>
                </button>
              ))}
            </div>

            <label className="search-box">
              <Search size={15} />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowAllProjects(false);
                }}
                placeholder="Search projects"
              />
            </label>
          </div>

          <div className="project-grid">
            {displayedProjects.map((p, i) => (
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
                <div className="project-card-top">
                  <span>FILE NO. 0{i + 1}</span>
                </div>

                <div className="project-symbol">
                  {p.type === 'Security'
                    ? '⌁'
                    : p.type === 'AI'
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
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          {visible.length > 3 && (
            <button
              type="button"
              className="project-show-more"
              aria-expanded={showAllProjects}
              onClick={() => setShowAllProjects((showAll) => !showAll)}
            >
              {showAllProjects ? 'SHOW LESS' : 'SHOW MORE'}
              <ChevronDown size={14} />
            </button>
          )}
        </div>
      </section>

      <ResearchPublications />

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

      {/* SKILLS / TOOLKIT */}
      <SkillArsenal />

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

        <div className="quote-walker-track" aria-hidden="true">
          <div className="quote-walker">
            <div className="quote-walker-pose">
              <img className="quote-walker-body" src="/footer-character.png" alt="" />
              <img className="quote-walker-leg quote-walker-leg-left" src="/footer-character.png" alt="" />
              <img className="quote-walker-leg quote-walker-leg-right" src="/footer-character.png" alt="" />
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