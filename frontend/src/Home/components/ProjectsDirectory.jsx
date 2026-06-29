import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';

const SCHOLARLY_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDUf6hMtCIwoYC5KpIwW2Tx3fRr4yukoMTYIxHGVYy6CkGhsgVvD0husr7Da2JWhR61HLkvxJXfT8qCF6sLu6HemV-t14o7hhQOJKykWkHdANyGKHNabYcxnXafIAn1Ytcw8L8Tf_UIYKmW21yjPt3paI6aiLxAX44UHxxLZn_k8j5DehTSNREYbg3FlN1Qmxiy7JRjYMtkg1DDQ-1EsGTINur054EREJMrNgWe7pTaHAmpC0kkscXWEkTiXidU34reP4JQ6b6tc-K7",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDLR52M2jFaPb_7HgPq4GuHLHP93pj8mrqqT76R02HT5y72HDgQ-rszSTgccLyZ5crkWNKiMHfdFF45h37uklei1Q2ZRB7F0XTJWI0tt5AezNi1LvEK_2g0zikfFKKuDjctUwyTX8Jdp8Nz1Wwhf-fLvcu1MnNoNIaXakVrLoVh-4f6NfUFDJwWdAzw_J1S5oEY5QkEG238oalpYxCCXwCydtdQTRlgmkTUr6tSpn5oOTVGvbuYz4T1VVrzcjW6uqp7_xc5HwyEi9Nf",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ-xrMHOTSyTGEaZCNGiU9gtTYSDojAQACt63gecdlIrSsG55GzaE3bicWwoTNTNAUKFERznT-yjwWHN5RalKznk_NmtOqeYDeUfH3gKx_SYB5RtGhawvD7o7cTe8KP3AUZrY-T69o5ZuM5kC7aCkzjMQu1ojJSMQWw0BxY__wuM5WvttYxSyKhOet10bEzjXqgytwMG_lIwCl0kRHPvPrq1V_bSyLxMB826x1JUbhFSbIPpl7gPsqoWpr9AIO2FuDJfWd-ZklxdOz",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBMWCwgITglCjMFiGhLDeRMIOt3EpWxXiQfEI0qngNHfWCZesJ29CXVZzB-FixPUsqzUCezweeknZW_tFJ2-5f8RRGeRy4MdBm9PeRAXOokcPlUgreENnHCVM-4D_JX_QKnFN9FPSfKzLyRfuan2aNBJPjmFx0Wj-SqIBc4dimxEJBH_ZDcU99hr7aNsKBQppqeN0WnFqBE7ndlYHXI-149E0CNtrZmByKgd7je_hlb3sAcxamSU7ICXiFL0NKXiyzHeqvX5kAIOCZI",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB1g2ZqTjW4KleUJFDXGMSymLSFLHl2HuYV9kniKLeY3Wn-7ZgLcdsToKCGMoJgM1ALsFvgSa5GdF1WGxDgTsELsgdTqm2B9hq1-XYjidyYoIQpKR2ql50qx_5asYck4sIO0Q4JcyDl2Q2VWqEv5GabwsawpOcX1PuSixdSp_ZPsBzK_YJnQbDUhCgn1YiedZHu5YYndKjUjimJh5jxmBA5t1ztl-wpHzie2Fwh3rxz-Dk-eUKY4y2kh_mYbnOWoFP04063Nya-ipH9"
];

const ProjectsDirectory = ({ boolIsProjectsLoadingState, arrFilteredProjectsState }) => {
  const navigate = useNavigate();

  return (
    <section className="ath-grid-section ath-reveal" id="projects">
      <aside className="ath-sidebar">
        <div className="ath-sidebar-sticky">
          <h3 className="ath-sidebar-title">Project Indices</h3>
          <ul className="ath-sidebar-list">
            <li className="ath-sidebar-item" onClick={() => navigate('/verisphere')}>
              <span className="ath-sidebar-item-name">VERISPHERE</span>
              <span className="ath-sidebar-item-code">001</span>
            </li>
            <li className="ath-sidebar-item" onClick={() => navigate('/credentials')}>
              <span className="ath-sidebar-item-name">ASSESSMENTS</span>
              <span className="ath-sidebar-item-code">042</span>
            </li>
            <li className="ath-sidebar-item" onClick={() => document.getElementById('video')?.scrollIntoView({ behavior: 'smooth' })}>
              <span className="ath-sidebar-item-name">SPOTLIGHT</span>
              <span className="ath-sidebar-item-code">109</span>
            </li>
            <li className="ath-sidebar-item" onClick={() => document.getElementById('merchandise')?.scrollIntoView({ behavior: 'smooth' })}>
              <span className="ath-sidebar-item-name">MERCHANDISE</span>
              <span className="ath-sidebar-item-code">215</span>
            </li>
          </ul>
          
          <div className="ath-sidebar-quote-box">
            <p className="ath-quote-text">
              "Built for discourse you can verify — where every claim carries its source."
            </p>
          </div>
        </div>
      </aside>

      <div className="ath-main-content">
        {boolIsProjectsLoadingState ? (
          <div className="ath-project-skeleton-list">
            {[1, 2].map((n) => (
              <div key={n} className="ath-project-skeleton-row">
                <div className="ath-skeleton-img-wrapper" />
                <div className="ath-skeleton-body">
                  <div className="ath-skeleton-line short" />
                  <div className="ath-skeleton-line title" />
                  <div className="ath-skeleton-line desc-1" />
                  <div className="ath-skeleton-line desc-2" />
                  <div className="ath-skeleton-line tags" />
                </div>
              </div>
            ))}
          </div>
        ) : arrFilteredProjectsState.length === 0 ? (
          <p style={{ color: 'var(--ath-text-muted)', textAlign: 'center', padding: '40px 0' }}>
            No case studies match your directory search.
          </p>
        ) : (
          arrFilteredProjectsState.map((project, idx) => {
            const isEven = idx % 2 === 0;
            const nameLower = (project.strName || '').toLowerCase();
            const techStack = project.strTechStack ? project.strTechStack.split(',').map(t => t.trim()) : [];
            const figLabel = `FIG. 0${idx + 1}`;

            const KICKER_MAP = {
              'verisphere': 'TRUST-BASED DISCOURSE',
              'credential assessment system': 'VERIFIABLE LEARNING',
              'spatial learning environment': 'CLASSROOM MAP',
              'merchandise': 'EXCLUSIVE APPAREL',
            };
            const CTA_MAP = {
              'verisphere': 'Experience Verisphere',
              'credential assessment system': 'Open CAS',
              'spatial learning environment': 'Enter the Map',
              'merchandise': 'Browse Collection',
            };
            const kicker = KICKER_MAP[nameLower] || `PROJECT 0${idx + 1}`;
            const ctaText = CTA_MAP[nameLower] || 'Explore';
            let ctaTo = '/verisphere';
            if (nameLower.includes('credential') || nameLower.includes('assessment')) {
              ctaTo = '/credentials';
            } else if (nameLower.includes('merchandise')) {
              ctaTo = '/shop';
            } else if (nameLower.includes('spatial') || nameLower.includes('classroom')) {
              ctaTo = '/sle';
            }

            return (
              <article
                key={project.id}
                className={`ath-article-row ${isEven ? 'ath-article-row-even' : ''}`}
              >
                <div className="ath-article-img-wrapper">
                  <img
                    src={SCHOLARLY_IMAGES[idx % SCHOLARLY_IMAGES.length]}
                    alt={project.strName}
                    className="ath-article-img"
                  />
                  <div className="ath-article-badge">{figLabel}</div>
                </div>

                <div className="ath-article-body">
                  <span className="ath-article-published">0{idx + 1} — {kicker}</span>
                  <h2 className="ath-article-title">{project.strName}</h2>
                  <p className="ath-article-desc">{project.strDescription}</p>

                  <div className="ath-article-tags">
                    {techStack.map((tech, i) => (
                      <span key={i} className="ath-article-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link to={ctaTo} className="ath-article-link" style={{ marginTop: '20px' }}>
                    {ctaText}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};

ProjectsDirectory.propTypes = {
  boolIsProjectsLoadingState: PropTypes.bool.isRequired,
  arrFilteredProjectsState: PropTypes.array.isRequired
};

export default ProjectsDirectory;
