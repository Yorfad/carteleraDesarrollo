// src/components/Footer.jsx
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="footer-copy">© {new Date().getFullYear()} CineYair</p>
        <ul className="social">
          <li>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="X / Twitter">
              <svg viewBox="0 0 24 24" className="icon"><path d="M18 2h3l-7.5 9.5L22 22h-6l-5-6.5L5 22H2l8-10.5L2 2h6l4.5 6L18 2z"/></svg>
            </a>
          </li>
          <li>
            <a href="https://facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" className="icon"><path d="M13 22v-8h3l1-4h-4V7a2 2 0 0 1 2-2h2V1h-3a5 5 0 0 0-5 5v3H6v4h3v8z"/></svg>
            </a>
          </li>
          <li>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" className="icon"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zm6.25-3.25a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25z"/></svg>
            </a>
          </li>
          <li>
            <a href="https://youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" className="icon"><path d="M23 7.5a4 4 0 0 0-2.8-2.8C18.7 4.2 12 4.2 12 4.2s-6.7 0-8.2.5A4 4 0 0 0 1 7.5 41.4 41.4 0 0 0 .5 12 41.4 41.4 0 0 0 1 16.5a4 4 0 0 0 2.8 2.8c1.5.5 8.2.5 8.2.5s6.7 0 8.2-.5A4 4 0 0 0 23 16.5 41.4 41.4 0 0 0 23.5 12 41.4 41.4 0 0 0 23 7.5zM10 15.5v-7l6 3.5z"/></svg>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
