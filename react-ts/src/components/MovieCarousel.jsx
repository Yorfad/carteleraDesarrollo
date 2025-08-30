// src/components/HeroCarousel.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function MovieCarousel({ items = [], interval = 5000, height = "62vh" }) {
  const slides = useMemo(() => items.slice(0, 3), [items]); // top 3
  const [i, setI] = useState(0);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    clear();
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) setI((p) => (p + 1) % slides.length);
    }, interval);
    return clear;
  }, [slides, interval]);

  const clear = () => timerRef.current && clearInterval(timerRef.current);
  const go = (idx) => setI((idx + slides.length) % slides.length);
  const next = () => go(i + 1);
  const prev = () => go(i - 1);

  if (!slides.length) return null;
  const s = slides[i];

  return (
    <section
      className="hero-carousel full-bleed"
      style={{ "--hero-h": height }}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onKeyDown={(e) => { if (e.key === "ArrowRight") next(); if (e.key === "ArrowLeft") prev(); }}
      tabIndex={0}
      aria-roledescription="carrusel"
    >
      {/* background */}
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${s.Poster || ""})` }}
        role="img"
        aria-label={`Póster de ${s.Title}`}
      />
      <div className="hero-overlay" />

      {/* content */}
      <div className="hero-content">
        <h2 className="hero-title">{s.Title}</h2>
        <p className="hero-meta">
          {s.Year && <span>{s.Year}</span>}
          {s.Type && <><span className="dot">•</span><span>{s.Type}</span></>}
          {(s.ubication || s.Ubication) && (
            <>
              <span className="dot">•</span>
              <span>{s.ubication || s.Ubication}</span>
            </>
          )}
        </p>
        {s.description && <p className="hero-desc">{s.description}</p>}

      </div>

      {/* controls */}
      <button className="hero-arrow left" aria-label="Anterior" onClick={prev}>‹</button>
      <button className="hero-arrow right" aria-label="Siguiente" onClick={next}>›</button>

      {/* dots */}
      <div className="hero-dots" role="tablist" aria-label="slides">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`hero-dot ${idx === i ? "active" : ""}`}
            onClick={() => go(idx)}
            role="tab"
            aria-selected={idx === i}
            aria-label={`Ir a slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
