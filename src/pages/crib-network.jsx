/* CRIB Network — Cumberland County */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{--navy:#0A1628;--navy-mid:#0D2045;--gold:#C9A84C;--gold-muted:#9E7E38;--bridge:#48BB78;--bridge-light:rgba(72,187,120,0.12);--white:#FFFFFF;--white-soft:#E8EDF5;--white-dim:#A0AEC0;--font-display:'Cormorant Garamond',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--font-mono:'JetBrains Mono',monospace;}
  html{scroll-behavior:smooth;}body{background:var(--navy);color:var(--white);font-family:var(--font-body);line-height:1.6;overflow-x:hidden;}
  .nav{position:fixed;top:0;left:0;right:0;z-index:100;height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1.5rem,5vw,4rem);background:rgba(10,22,40,0.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(72,187,120,0.15);}
  .nav-logo{font-family:var(--font-display);font-size:1.4rem;font-weight:700;color:var(--white);text-decoration:none;}.nav-logo span{color:var(--bridge);}
  .nav-back{font-size:0.78rem;color:var(--white-dim);text-decoration:none;font-family:var(--font-mono);letter-spacing:0.05em;transition:color 0.2s;}.nav-back:hover{color:var(--bridge);}
  .nav-cta{background:var(--bridge);color:var(--navy);font-size:0.78rem;font-weight:700;padding:0.45rem 1.1rem;border-radius:9999px;text-decoration:none;}
  .hero{min-height:80vh;display:flex;align-items:center;padding:120px clamp(1.5rem,5vw,4rem) 5rem;background:linear-gradient(135deg,#0A1628 0%,#0C1F30 60%,#0A1628 100%);position:relative;overflow:hidden;}
  .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 55% at 65% 45%,rgba(72,187,120,0.08),transparent);pointer-events:none;}
  .hero-inner{max-width:1280px;margin:0 auto;width:100%;display:grid;grid-template-columns:1.2fr 0.8fr;gap:5rem;align-items:center;}
  .badge{display:inline-flex;align-items:center;gap:0.375rem;padding:0.3rem 0.75rem;border-radius:9999px;font-family:var(--font-mono);font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;background:var(--bridge-light);border:1px solid rgba(72,187,120,0.25);color:var(--bridge);margin-bottom:1.25rem;}
  .hero-headline{font-family:var(--font-display);font-size:clamp(2.75rem,5vw,4.5rem);font-weight:900;line-height:1.05;letter-spacing:-0.02em;color:var(--white);margin-bottom:1.25rem;}
  .hero-headline em{color:var(--bridge);font-style:normal;}
  .hero-sub{font-size:1rem;color:var(--white-soft);line-height:1.75;max-width:500px;margin-bottom:2rem;}
  .cta-row{display:flex;gap:1rem;flex-wrap:wrap;}
  .btn-bridge{background:var(--bridge);color:var(--navy);font-size:0.875rem;font-weight:700;padding:0.875rem 2rem;border-radius:9999px;border:none;cursor:pointer;letter-spacing:0.03em;transition:filter 0.2s,transform 0.2s;text-decoration:none;display:inline-block;}
  .btn-bridge:hover{filter:brightness(1.1);transform:scale(1.02);}
  .btn-outline{background:transparent;color:var(--bridge);font-size:0.875rem;font-weight:600;padding:0.875rem 2rem;border-radius:9999px;border:1.5px solid var(--bridge);cursor:pointer;text-decoration:none;display:inline-block;}
  .stats-card{background:linear-gradient(145deg,#0D2045,#1A3560);border:1px solid rgba(72,187,120,0.25);border-radius:14px;padding:2rem;}
  .stats-label{font-family:var(--font-mono);font-size:0.62rem;letter-spacing:0.15em;color:var(--bridge);text-transform:uppercase;margin-bottom:1rem;}
  .stat-row{display:flex;justify-content:space-between;align-items:center;padding:0.75rem 0;border-bottom:1px solid rgba(255,255,255,0.05);}
  .stat-row:last-child{border-bottom:none;}
  .stat-key{font-size:0.8rem;color:var(--white-dim);}
  .stat-val{font-size:0.875rem;font-weight:600;color:var(--bridge);}
  .section{padding:5.5rem clamp(1.5rem,5vw,4rem);}.section-inner{max-width:1280px;margin:0 auto;}
  .eyebrow{font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.18em;color:var(--bridge);text-transform:uppercase;margin-bottom:0.875rem;display:flex;align-items:center;gap:0.75rem;}
  .eyebrow::before{content:'';display:block;width:3px;height:36px;background:var(--bridge);border-radius:2px;}
  .s-headline{font-family:var(--font-display);font-size:clamp(1.75rem,3vw,2.75rem);font-weight:700;color:var(--white);line-height:1.15;margin-bottom:1rem;}
  .services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;}
  .service-card{background:var(--bridge-light);border:1px solid rgba(72,187,120,0.2);border-radius:12px;padding:1.5rem;}
  .service-title{font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--white);margin-bottom:0.5rem;}
  .service-body{font-size:0.83rem;color:var(--white-soft);line-height:1.6;}
  .divider{width:100%;height:1px;background:linear-gradient(to right,transparent,rgba(72,187,120,0.2),transparent);}
  .m2m-badge{text-align:center;padding:2.5rem;background:#060F1E;border-top:1px solid rgba(72,187,120,0.12);}
  .m2m-badge p{font-family:var(--font-mono);font-size:0.62rem;letter-spacing:0.12em;color:var(--gold-muted);text-transform:uppercase;margin-bottom:0.375rem;}
  .m2m-badge a{color:var(--gold);text-decoration:none;font-weight:600;}
  .footer{background:#060F1E;padding:1.75rem clamp(1.5rem,5vw,4rem);border-top:1px solid rgba(255,255,255,0.05);}
  .footer-inner{max-width:1280px;margin:0 auto;display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;font-size:0.72rem;color:var(--white-dim);}
  @media(max-width:900px){.hero-inner{grid-template-columns:1fr;}.services-grid{grid-template-columns:1fr;}}
`;

const SERVICES = [
  { title: "Workforce Re-Entry", body: "Structured 90-day re-entry pipeline for returning citizens and displaced workers in Cumberland County. BRIDGE OS™ framework applied." },
  { title: "Community Navigation", body: "Casework + referral network connecting participants to housing, employment, benefits, and mental health support." },
  { title: "Employer Partnerships", body: "Job-ready pipeline to vetted Cumberland County employers. Reducing first-year turnover through BRIDGE OS™ integration protocols." },
];

export function CribNetwork() {
  return (
    <>
      <style>{styles}</style>
      <nav className="nav">
        <a href="/" className="nav-logo">CRIB <span>Network</span></a>
        <a href="/bridge-os" className="nav-back">← BRIDGE OS™</a>
        <a href="/contact" className="nav-cta">Get Involved</a>
      </nav>
      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="badge">CRIB Network · Cumberland County, NC</div>
            <h1 className="hero-headline">Community.<br /><em>Re-Entry.</em><br />Infrastructure.</h1>
            <p className="hero-sub">The CRIB Network is a workforce re-entry and community navigation platform for Cumberland County — connecting displaced workers and returning citizens to jobs, support, and a structured path forward.</p>
            <div className="cta-row">
              <a href="/contact" className="btn-bridge">Partner With CRIB</a>
              <a href="/bridge-os" className="btn-outline">BRIDGE OS™ Platform</a>
            </div>
          </div>
          <div className="stats-card">
            <p className="stats-label">Pipeline Intelligence · HubSpot</p>
            {[
              ["Active Pipeline Value","$325,000"],["County","Cumberland, NC"],["Platform","BRIDGE OS™"],["Lead","M2M~Inc. · SDVOSB"],["Status","Active Development"],
            ].map(([k,v]) => (
              <div key={k} className="stat-row"><span className="stat-key">{k}</span><span className="stat-val">{v}</span></div>
            ))}
          </div>
        </div>
      </section>
      <div className="divider" />
      <section className="section">
        <div className="section-inner">
          <p className="eyebrow">Services</p>
          <h2 className="s-headline">Three CRIB Network<br />Service Lanes</h2>
          <div className="services-grid">
            {SERVICES.map(s => (
              <div key={s.title} className="service-card">
                <h3 className="service-title">{s.title}</h3>
                <p className="service-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="m2m-badge">
        <p>A Human OS™ Initiative</p>
        <a href="/">model2message.net</a>
      </div>
      <footer className="footer">
        <div className="footer-inner">
          <span>© 2026 M2M~Inc. CRIB Network is a BRIDGE OS™ community initiative.</span>
          <a href="/" style={{ color: "var(--gold)", textDecoration: "none" }}>model2message.net</a>
        </div>
      </footer>
    </>
  );
}

export default CribNetwork;
