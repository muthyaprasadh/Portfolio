import { X, ExternalLink, Github, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { playTapeClick } from '@/lib/sound';

export interface ProjectData {
  title: string;
  type: string;
  description: string;
  tech: string[];
  status?: string;
  github?: string;
  demo?: string;
  fileNo?: string;
}

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

const detailedCaseFiles: Record<string, {
  problem: string;
  architecture: string[];
  highlights: string[];
  metrics: string[];
}> = {
  'AI Job Matching Agent': {
    problem: 'Job discovery and resume matching are repetitive, while automated application submission creates serious risks around privacy and inaccurate claims.',
    architecture: [
      'Python CLI and FastAPI service for fetching, searching and reviewing job listings',
      'BM25 and MiniLM embedding retrieval with reciprocal-rank fusion and optional cross-encoder reranking',
      'PostgreSQL with pgvector for persistent embeddings, with an in-memory fallback',
      'SQLite-backed profile and conversation memory with Pydantic-validated application drafts'
    ],
    highlights: [
      'Ranks public listings against role-specific resumes and candidate profile skills',
      'Uses human approval checkpoints and never submits applications automatically',
      'Includes Docker Compose deployment and evaluation metrics for retrieval strategies'
    ],
    metrics: ['Hybrid Retrieval', 'Human-in-the-Loop', 'Dockerized API']
  },
  'Document Q&A Chatbot (RAG)': {
    problem: 'Users need accurate answers grounded in large document collections without relying only on model memory or manually searching source material.',
    architecture: [
      'FastAPI endpoint exposing document-question answering',
      'PDF ingestion pipeline using PyPDF for document text extraction',
      'Sentence Transformer embeddings with Endee vector retrieval',
      'LLM generation step using retrieved document context to compose answers'
    ],
    highlights: [
      'Retrieves relevant source context before generating a response',
      'Provides a lightweight REST interface for document Q&A',
      'Separates ingestion, retrieval and generation into modular Python components'
    ],
    metrics: ['RAG Pipeline', 'Vector Retrieval', 'FastAPI']
  },
  'PayFlow — Enterprise Payment Gateway': {
    problem: 'Traditional small-business payment integrations often suffer from fragmented authentication, vulnerable webhooks, and lack of automated fraud-detection workflows.',
    architecture: [
      'Stateless Spring Security architecture with RSA-signed JWT tokens',
      'Idempotent payment transactions backed by MySQL with strict isolation levels',
      'Asynchronous webhook delivery pipeline with exponential backoff retries',
      'Layered role-based access control (RBAC) separating customers, merchants, and auditors'
    ],
    highlights: [
      'Sub-50ms token validation latency using in-memory caching',
      'Tamper-evident audit logging for all balance adjustments and transfers',
      'Fraud-detection rule engine flagging anomalous velocity and cross-geo attempts'
    ],
    metrics: ['JWT Authentication', 'Idempotent Transactions', 'Audit Logging']
  },
  'HelpHub — Community Assistance': {
    problem: 'During local emergencies and mutual-aid requests, centralized dispatchers cause bottlenecks and slow response times for vulnerable citizens needing immediate assistance.',
    architecture: [
      'React single-page application with responsive state management',
      'Node.js & Express REST micro-services connected to MongoDB clusters',
      'Real-time bi-directional task claim broadcasts powered by WebSockets',
      'Geo-proximity matching querying spatial indices for nearest verified responders'
    ],
    highlights: [
      'Sub-second real-time notification push to nearby volunteers',
      'Role-based responder verification workflow to prevent unauthorized interventions',
      'Lightweight offline caching for unreliable mobile network conditions'
    ],
    metrics: ['Real-Time Communication', 'Location-Aware Matching', 'Role-Based Workflows']
  },
  'Smart Farmer Advisory System': {
    problem: 'Smallholder agricultural producers lack timely, automated detection of crop pathologies and weather anomalies in regional vernacular dialects.',
    architecture: [
      'Serverless AWS Lambda compute pipelines triggered by API Gateway',
      'Computer vision crop pest detection utilizing AWS Rekognition models',
      'DynamoDB low-latency document storage for sensor logs and harvest metrics',
      'Multilingual voice and SMS advisory dissemination via AWS Polly and SNS'
    ],
    highlights: [
      'Zero idle compute cost via pure serverless cloud architecture',
      'Multilingual audio advisory generation for farmers unable to read text notifications',
      'Automated satellite weather telemetry correlation with soil moisture forecasts'
    ],
    metrics: ['Serverless AWS Workflow', 'Image-Based Crop Insights', 'Multilingual Voice Alerts']
  },
  'ContiFood-961 Food Benchmark': {
    problem: 'Fine-grained visual categorization on real-world food imagery suffers from severe class imbalance and long-tailed distributional shifts.',
    architecture: [
      'PyTorch deep learning pipeline implementing ResNet-152 and Vision Transformer backbones',
      'Data augmentation regimen addressing high intraclass variance across 961 distinct categories',
      'Class-balanced focal loss optimization mitigating heavy frequency decay'
    ],
    highlights: [
      'Evaluated attention-based visual features against extreme long-tailed distributions',
      'Generated standardized evaluation benchmark protocol for future dietary AI research',
      'Engineered automated validation splits ensuring zero data leakage'
    ],
    metrics: ['961 Food Categories', 'Long-Tailed Dataset', 'Visual Learning Baselines']
  },
  'Cross-Artifact Incident Reconstruction': {
    problem: 'Modern security incident response requires tedious manual cross-referencing between disjoint endpoint logs, packet captures, and filesystem timestamps.',
    architecture: [
      'Python artifact parsing engine extracting timeline events from Windows EVTX and Sysmon',
      'Wireshark / PCAP correlation engine aligning network flows with process creation trees',
      'NetworkX unified directed graph modeling causal lateral movement'
    ],
    highlights: [
      'Automated parent-child process tree reconstruction highlighting anomalous spawn chains',
      'Graph-based attack path discovery pinpointing initial entry vector',
      'Exportable timeline artifacts compatible with MITRE ATT&CK taxonomy'
    ],
    metrics: ['Cross-Artifact Correlation', 'Endpoint + Network Evidence', 'Incident Timeline Graph']
  },
  "Parkinson's Severity Prediction": {
    problem: 'Clinical motor score evaluations (UPDRS) require frequent in-person specialist assessments, causing delays in disease progression monitoring.',
    architecture: [
      'Machine learning pipeline in Python utilizing Scikit-learn, Pandas, and NumPy',
      'Extracted biomedical acoustic features and motor telemetry features',
      'Ensemble gradient boosting regressors estimating Motor and Total UPDRS scores'
    ],
    highlights: [
      'Rigorous cross-validation strategy minimizing patient data overlap across folds',
      'Feature importance analysis identifying speech tremor indicators correlating with motor scores',
      'Interactive Streamlit doctor dashboard providing real-time regression telemetry'
    ],
    metrics: ['Low RMSE Regression', 'Acoustic Feature Extraction', 'Clinician UI']
  }
};

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  if (!project) return null;

  const details = detailedCaseFiles[project.title] || {
    problem: project.description,
    architecture: ['Engineered modular architecture', 'Full-stack integration', 'Production-ready workflows'],
    highlights: ['Secure, optimized data flows', 'Responsive modern UI/UX', 'Comprehensive automated error handling'],
    metrics: ['Production Ready', 'Scalable Architecture', 'Tested Workflows']
  };

  return (
    <div className="project-modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="project-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div className="modal-topbar">
          <div className="modal-title-box">
            <span className="live-dot" />
            <span className="case-id">{project.fileNo || 'EVIDENCE FILE'}</span>
            <span className="case-status">{project.status || 'VERIFIED ARTIFACT'}</span>
          </div>

          <button
            className="modal-close-btn"
            onClick={() => {
              playTapeClick();
              onClose();
            }}
            aria-label="Close Case File"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-body">
          <div className="modal-stamp-badge">
            CLASSIFIED
            <br />
            CASE EVIDENCE
          </div>

          <span className="modal-category">{project.type} // CASE DOSSIER</span>
          <h2 className="modal-project-title">{project.title}</h2>
          <p className="modal-lead-summary">{project.description}</p>

          {/* Key Metrics Strip */}
          <div className="modal-metrics-strip">
            {details.metrics.map((m, idx) => (
              <div key={idx} className="metric-pill">
                <CheckCircle2 size={13} className="text-red-500" />
                <span>{m}</span>
              </div>
            ))}
          </div>

          {/* Problem Statement */}
          <div className="modal-section">
            <h4 className="section-label">
              <span className="bullet-indicator" /> THE INVESTIGATION / PROBLEM
            </h4>
            <p className="section-text">{details.problem}</p>
          </div>

          {/* System Architecture */}
          <div className="modal-section">
            <h4 className="section-label">
              <span className="bullet-indicator" /> ARCHITECTURE & FORENSIC SPECIFICATIONS
            </h4>
            <ul className="spec-list">
              {details.architecture.map((item, idx) => (
                <li key={idx}>
                  <ShieldCheck size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Engineering Highlights */}
          <div className="modal-section">
            <h4 className="section-label">
              <span className="bullet-indicator" /> KEY ENGINEERING HIGHLIGHTS
            </h4>
            <ul className="spec-list">
              {details.highlights.map((item, idx) => (
                <li key={idx}>
                  <span className="dash-marker">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Tags */}
          <div className="modal-tech-box">
            <span className="tech-label">COMPILED TECHNOLOGIES:</span>
            <div className="tech-pills">
              {project.tech.map((t) => (
                <span key={t} className="tech-badge">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="modal-footer">
          <div className="modal-launch-actions">
          {project.demo && project.demo !== '#' && (
            <a href={project.demo} target="_blank" rel="noreferrer" className="modal-action-btn primary" onClick={() => playTapeClick()}>
              <ExternalLink size={15} /><span>LAUNCH LIVE DEMO</span>
            </a>
          )}
          {project.github && project.github !== '#' ? (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="modal-action-btn primary"
              onClick={() => playTapeClick()}
            >
              <Github size={15} />
              <span>EXPLORE REPOSITORY</span>
              <ExternalLink size={13} />
            </a>
          ) : (
            <span className="modal-restricted-badge">
              CLASSIFIED // SOURCE CODE AVAILABLE ON VERIFIED REQUEST
            </span>
          )}

          </div>
          <button
            className="modal-action-btn secondary"
            onClick={() => {
              playTapeClick();
              onClose();
            }}
          >
            CLOSE FILE
          </button>
        </div>
      </div>
    </div>
  );
};
