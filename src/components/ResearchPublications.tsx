import { ArrowUpRight, FileText } from 'lucide-react';
import './ResearchPublications.css';

export const ResearchPublications = () => (
  <section className="section research-section" id="research">
    <div className="wrap">
      <div className="section-heading">
        <span className="eyebrow">RESEARCH / PUBLICATIONS</span>
        <h2>
          Research & <em>publications.</em>
        </h2>
        <p>Research spanning computer vision and privacy-preserving machine learning.</p>
      </div>

      <article className="research-paper-card">
        <div className="research-paper-topline">
          <span className="research-status">ACCEPTED · EXTENDED ABSTRACT</span>
          <span className="research-presentation">POSTER + VIDEO · BOARD 89L</span>
        </div>

        <h3>ContiFood-961: A Fine-Grained Long-Tailed Food Benchmark for Classification</h3>

        <div className="research-paper-venue">
          <strong>3rd MetaFood Workshop (MTF 2026)</strong>
          <p>
            Held in conjunction with the IEEE/CVF Conference on Computer Vision and
            Pattern Recognition (CVPR 2026) · June 3, 2026.
          </p>
        </div>

        <a
          className="research-program-link"
          href="https://sites.google.com/view/cvpr-metafood-2026/program"
          target="_blank"
          rel="noreferrer"
        >
          <FileText size={16} />
          VIEW OFFICIAL WORKSHOP PROGRAM
          <ArrowUpRight size={15} />
        </a>
      </article>

      <article className="research-paper-card">
        <div className="research-paper-topline">
          <span className="research-status">UNDER REVIEW</span>
          <span className="research-presentation">JOURNAL SUBMISSION · ICCIS_CR</span>
        </div>

        <h3>Verifiable Machine Learning for Privacy-Preserving Phishing Detection</h3>

        <p className="research-paper-summary">
          Proposes a phishing-detection framework that uses zero-knowledge proofs to
          verify machine-learning predictions without revealing input data or model
          parameters. Its prototype reports faster verification than inference with
          moderate computational overhead.
        </p>
      </article>
    </div>
  </section>
);
