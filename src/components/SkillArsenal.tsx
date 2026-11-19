import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { GitHubSurveillance } from '@/components/GitHubSurveillance';
import './SkillArsenal.css';

const categories = [
  {
    number: '01',
    name: 'Languages',
    featured: true,
    wide: true,
    skills: ['Java', 'Python', 'C', 'C++', 'Kotlin', 'JavaScript', 'TypeScript', 'SQL']
  },
  {
    number: '02',
    name: 'Frontend',
    skills: ['React', 'HTML5', 'CSS3', 'Tailwind CSS', 'Jetpack Compose']
  },
  {
    number: '03',
    name: 'Backend',
    wide: true,
    skills: ['Spring Boot', 'Spring Security', 'Node.js', 'Express.js', 'REST APIs', 'JWT', 'WebSockets']
  },
  {
    number: '04',
    name: 'Databases',
    skills: ['MySQL', 'MongoDB', 'DynamoDB', 'PostgreSQL']
  },
  {
    number: '05',
    name: 'Cloud & DevOps',
    wide: true,
    skills: ['AWS Lambda', 'API Gateway', 'S3', 'Git', 'GitHub', 'Maven', 'Docker']
  },
  {
    number: '06',
    name: 'AI',
    skills: ['PyTorch', 'Scikit-learn', 'Computer Vision', 'RAG']
  },
  {
    number: '07',
    name: 'Security',
    wide: true,
    skills: ['Wireshark', 'ZKPs', 'KAPE', 'Network Forensics', 'Digital Forensics', 'Incident Response']
  }
];

export const SkillArsenal = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const trackTarget = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;

    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--target-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--target-y', `${event.clientY - bounds.top}px`);
    event.currentTarget.classList.add('is-targeting');
  };

  const resetTarget = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.classList.remove('is-targeting');
  };

  const tiltCard = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty('--tilt-x', `${(horizontal * 7).toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(vertical * -7).toFixed(2)}deg`);
  };

  const resetCardTilt = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <section
      ref={sectionRef}
      className={`section stack-section skill-arsenal${isVisible ? ' is-visible' : ''}`}
      id="stack"
      onPointerMove={trackTarget}
      onPointerLeave={resetTarget}
    >
      <div className="skill-target" aria-hidden="true" />
      <div className="wrap skill-arsenal-content">
        <div className="section-heading skill-arsenal-heading">
          <span className="eyebrow">04 / TOOLKIT</span>
          <h2>
            MY TOOLS. <em>MY WEAPONS.</em>
          </h2>
          <p>A carefully assembled arsenal for engineering, intelligence and security.</p>
        </div>

        <div className="skill-grid">
          {categories.map((category) => (
            <article
              className={`skill-group skill-card${category.wide ? ' skill-card-wide' : ''}${category.featured ? ' skill-card-featured' : ''}`}
              key={category.name}
              onPointerMove={tiltCard}
              onPointerLeave={resetCardTilt}
            >
              <div className="skill-card-heading">
                <span className="skill-number">{category.number}</span>
                <span className="skill-separator" aria-hidden="true">—</span>
                <h3>{category.name}</h3>
              </div>

              <div className="skill-pills">
                {category.skills.map((skill) => (
                  <span className="skill-pill" key={skill}>{skill}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <GitHubSurveillance />
        <div className="github-note">
          <Github size={19} />
          <div>
            <strong>Code lives on GitHub.</strong>
            <p>Explore repositories and experiments on my profile.</p>
          </div>
          <a
            href="https://github.com/muthyaprasadh"
            target="_blank"
            rel="noreferrer"
          >
            OPEN GITHUB <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
};
