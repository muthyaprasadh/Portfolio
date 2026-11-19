export type Project = {
  title: string;
  type: string;
  description: string;
  tech: string[];
  status?: string;
  github?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    title: 'AI Job Matching Agent',
    type: 'AI',
    description:
      'A human-reviewed job-search assistant that collects public listings, ranks them against role-specific resumes, and generates application drafts using hybrid retrieval and tool-calling agents.',
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'BM25', 'Sentence Transformers', 'Docker'],
    github: 'https://github.com/muthyaprasadh/AI-job-matching-agent',
    status: 'FEATURED'
  },
  {
    title: 'Document Q&A Chatbot (RAG)',
    type: 'AI',
    description:
      'A retrieval-augmented document question-answering chatbot that ingests PDF files, generates embeddings, retrieves relevant context and produces grounded answers through an API.',
    tech: ['Python', 'FastAPI', 'RAG', 'Sentence Transformers', 'OpenAI', 'PyPDF', 'Endee'],
    github: 'https://github.com/muthyaprasadh/Document-Q-A-Chatbot-RAG-',
    status: 'FEATURED'
  },
  {
    title: 'PayFlow — Enterprise Payment Gateway',
    type: 'Fullstack',
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
    type: 'Fullstack',
    description:
      'A serverless agricultural advisory platform combining image-based crop insights with multilingual notifications and voice support.',
    tech: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Rekognition', 'SNS', 'Polly'],
    github: 'https://github.com/muthyaprasadh/AWS_farmer_advisory'
  },
  {
    title: 'ContiFood-961 Food Benchmark',
    type: 'Research',
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
    type: 'AI',
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
