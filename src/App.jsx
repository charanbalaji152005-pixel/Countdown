import React, { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_SECONDS = 10;

export default function App() {
  const [count, setCount] = useState(TOTAL_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isPaused || isDone) {
      return;
    }

    if (count === 0) {
      timeoutRef.current = setTimeout(() => {
        setIsDone(true);
      }, 700);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }

    const intervalId = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [count, isPaused, isDone]);

  const handleTogglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setCount(TOTAL_SECONDS);
    setIsPaused(false);
    setIsDone(false);
  }, []);

  // Progress ring calculation (radius = 96)
  const ringRadius = 96;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference * (1 - count / TOTAL_SECONDS);

  return (
    <div className="app-viewport">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800;900&family=Rajdhani:wght@500;600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          margin: 0;
          padding: 0;
          background-color: #05070f;
          color: #e2e8f0;
          font-family: 'Rajdhani', sans-serif;
          overflow-x: hidden;
        }

        .app-viewport {
          min-height: 100vh;
          width: 100%;
          background-color: #05070f;
          background-image: 
            radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.16) 0%, rgba(168, 85, 247, 0.08) 35%, transparent 70%),
            radial-gradient(circle at 50% 100%, rgba(168, 85, 247, 0.08) 0%, transparent 60%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
        }

        .layout-container {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Glowing Gradient Border Card */
        .countdown-card {
          position: relative;
          width: 100%;
          background: rgba(8, 12, 24, 0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 26px;
          padding: 36px 24px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid transparent;
          background-clip: padding-box;
          box-shadow: 
            0 10px 40px -10px rgba(0, 0, 0, 0.8),
            0 0 35px -5px rgba(0, 240, 255, 0.22),
            0 0 45px -5px rgba(168, 85, 247, 0.16),
            inset 0 0 25px rgba(0, 240, 255, 0.03);
          transition: all 0.3s ease;
        }

        .countdown-card::before {
          content: '';
          position: absolute;
          inset: -1.5px;
          border-radius: 27.5px;
          padding: 1.5px;
          background: linear-gradient(145deg, #00f0ff, rgba(168, 85, 247, 0.8), rgba(0, 240, 255, 0.2));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
        }

        /* Title & Subtitle */
        .title-group {
          text-align: center;
          margin-bottom: 22px;
        }

        .main-title {
          font-family: 'Orbitron', monospace, sans-serif;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 24px;
          line-height: 1.25;
          margin: 0 0 6px 0;
          background: linear-gradient(135deg, #00f0ff 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 12px rgba(0, 240, 255, 0.35));
        }

        .sub-title {
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(148, 163, 184, 0.65);
          margin: 0;
        }

        /* EXACT CSS CLASSES FROM SPECIFICATION */
        .loader-stage {
          position: relative;
          width: 280px;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .loader-svg {
          filter: drop-shadow(0 0 10px rgba(0,240,255,0.55));
        }

        .orbit-track {
          fill: none;
          stroke-width: 1;
        }

        .track-outer {
          stroke: rgba(0,240,255,0.05);
        }

        .track-middle {
          stroke: rgba(168,85,247,0.04);
        }

        .track-inner {
          stroke: rgba(0,240,255,0.05);
        }

        /* Core circle */
        .core-circle {
          fill: #070b16;
          stroke: rgba(0, 240, 255, 0.25);
          stroke-width: 1.5;
        }

        /* Progress Ring */
        .progress-ring {
          fill: none;
          stroke-width: 7;
          stroke-linecap: round;
          stroke: url(#cyanPurpleGrad);
          transition: stroke-dashoffset 0.85s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 0 6px rgba(0, 240, 255, 0.6));
        }

        /* Orbiting Arcs */
        .orbit-group {
          transform-origin: 140px 140px;
        }

        .orbit-arc-1 {
          animation: spin 5s linear infinite;
        }

        .orbit-arc-2 {
          animation: spin-reverse 7s linear infinite;
        }

        .orbit-arc-3 {
          animation: spin 9s linear infinite;
        }

        .is-paused .orbit-arc-1,
        .is-paused .orbit-arc-2,
        .is-paused .orbit-arc-3,
        .orbit-arc-1.is-paused,
        .orbit-arc-2.is-paused,
        .orbit-arc-3.is-paused {
          animation-play-state: paused;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        /* Count Display Center */
        .count-center {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          user-select: none;
        }

        .count-number {
          font-family: 'Orbitron', monospace, sans-serif;
          font-size: 64px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1;
          text-shadow: 
            0 0 10px #00f0ff,
            0 0 20px rgba(0, 240, 255, 0.75),
            0 0 35px #a855f7,
            0 0 50px rgba(168, 85, 247, 0.5);
          animation: number-pop 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
          display: inline-block;
        }

        @keyframes number-pop {
          0% {
            transform: scale(1.25);
            opacity: 0.85;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Buttons */
        .button-group {
          display: flex;
          gap: 16px;
          width: 100%;
          max-width: 320px;
        }

        .btn-action {
          flex: 1;
          font-family: 'Orbitron', monospace, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 13px;
          font-weight: 700;
          border-radius: 12px;
          padding: 13px 20px;
          cursor: pointer;
          background: transparent;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-action:focus-visible {
          outline: 2px solid #ffffff;
          outline-offset: 3px;
        }

        .btn-pause {
          color: #00f0ff;
          border: 1.5px solid #00f0ff;
          background: rgba(0, 240, 255, 0.05);
        }

        .btn-pause:hover {
          background: rgba(0, 240, 255, 0.16);
          box-shadow: 0 0 16px rgba(0, 240, 255, 0.65), inset 0 0 10px rgba(0, 240, 255, 0.3);
          transform: translateY(-2px);
        }

        .btn-reset {
          color: #c084fc;
          border: 1.5px solid #a855f7;
          background: rgba(168, 85, 247, 0.05);
        }

        .btn-reset:hover {
          background: rgba(168, 85, 247, 0.16);
          box-shadow: 0 0 16px rgba(168, 85, 247, 0.65), inset 0 0 10px rgba(168, 85, 247, 0.3);
          transform: translateY(-2px);
        }

        /* END STATE (COMING SOON) */
        .coming-soon-screen {
          position: relative;
          width: 100%;
          min-height: 480px;
          background: rgba(8, 12, 24, 0.88);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 26px;
          padding: 48px 24px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px solid transparent;
          background-clip: padding-box;
          box-shadow: 
            0 15px 50px -10px rgba(0, 0, 0, 0.85),
            0 0 45px -5px rgba(0, 240, 255, 0.28),
            0 0 55px -5px rgba(168, 85, 247, 0.22);
          animation: fade-enter 0.5s ease-out forwards;
        }

        .coming-soon-screen::before {
          content: '';
          position: absolute;
          inset: -1.5px;
          border-radius: 27.5px;
          padding: 1.5px;
          background: linear-gradient(145deg, #00f0ff, #f472b6, #a855f7);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
        }

        @keyframes fade-enter {
          0% {
            opacity: 0;
            transform: scale(0.96);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .badge-sync {
          font-family: 'Orbitron', monospace, sans-serif;
          font-size: 11px;
          letter-spacing: 0.25em;
          color: #00f0ff;
          text-transform: uppercase;
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid rgba(0, 240, 255, 0.35);
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 24px;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.2);
        }

        .heading-coming-soon {
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          line-height: 1.08;
        }

        .text-coming {
          font-family: 'Orbitron', monospace, sans-serif;
          font-size: clamp(48px, 12vw, 72px);
          font-weight: 900;
          letter-spacing: 0.2em;
          color: #e6fcff;
          text-shadow: 
            0 0 15px rgba(0, 240, 255, 0.9),
            0 0 30px rgba(0, 240, 255, 0.65),
            0 0 50px rgba(0, 240, 255, 0.4);
        }

        .text-soon {
          font-family: 'Orbitron', monospace, sans-serif;
          font-size: clamp(48px, 12vw, 72px);
          font-weight: 900;
          letter-spacing: 0.2em;
          color: #fdf2f8;
          text-shadow: 
            0 0 15px rgba(244, 114, 182, 0.95),
            0 0 32px rgba(168, 85, 247, 0.8),
            0 0 55px rgba(168, 85, 247, 0.5);
        }

        .coming-desc {
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: rgba(226, 232, 240, 0.88);
          letter-spacing: 0.06em;
          margin: 22px 0 32px 0;
          max-width: 360px;
          line-height: 1.5;
        }

        .btn-reinit {
          font-family: 'Orbitron', monospace, sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ffffff;
          padding: 14px 26px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(0, 240, 255, 0.18), rgba(168, 85, 247, 0.28));
          border: 1.5px solid #00f0ff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.35);
        }

        .btn-reinit:hover {
          background: linear-gradient(135deg, rgba(0, 240, 255, 0.32), rgba(168, 85, 247, 0.42));
          box-shadow: 0 0 28px rgba(0, 240, 255, 0.7), 0 0 42px rgba(168, 85, 247, 0.45);
          transform: translateY(-2px);
        }

        .btn-reinit:focus-visible {
          outline: 2px solid #ffffff;
          outline-offset: 3px;
        }

        .reinit-icon {
          transition: transform 0.45s ease;
        }

        .btn-reinit:hover .reinit-icon {
          transform: rotate(-180deg);
        }

        /* Prefers-reduced-motion accessibility */
        @media (prefers-reduced-motion: reduce) {
          .orbit-arc-1,
          .orbit-arc-2,
          .orbit-arc-3 {
            animation: none !important;
          }
          .count-number {
            animation: none !important;
          }
          .progress-ring {
            transition: none !important;
          }
          .coming-soon-screen {
            animation: none !important;
          }
          .btn-reinit:hover .reinit-icon {
            transform: none !important;
          }
        }
      `}</style>

      <div className="layout-container">
        {!isDone ? (
          <div className="countdown-card">
            <div className="title-group">
              <h1 className="main-title">LOADER COUNTDOWN</h1>
              <p className="sub-title">NEURAL TIMER SUBSYSTEM</p>
            </div>

            <div className="loader-stage">
              <svg
                className="loader-svg"
                width="280"
                height="280"
                viewBox="0 0 280 280"
                aria-hidden="true"
              >
                <defs>
                  {/* Linear gradient for progress ring */}
                  <linearGradient id="cyanPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>

                  {/* Glow filters for dots */}
                  <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="glowPurple" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="glowPink" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Three concentric circle tracks (.orbit-track) */}
                <circle cx="140" cy="140" r="130" className="orbit-track track-outer" />
                <circle cx="140" cy="140" r="112" className="orbit-track track-middle" />
                <circle cx="140" cy="140" r="82" className="orbit-track track-inner" />

                {/* Dark core circle */}
                <circle cx="140" cy="140" r="68" className="core-circle" />

                {/* Thick progress ring driven by count / 10 */}
                <circle
                  cx="140"
                  cy="140"
                  r={ringRadius}
                  className="progress-ring"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 140 140)"
                />

                {/* Orbiting arc 1: Cyan thin with glowing dot, 5s */}
                <g className={`orbit-group orbit-arc-1 ${isPaused ? 'is-paused' : ''}`}>
                  <circle
                    cx="140"
                    cy="140"
                    r="130"
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="1.5"
                    strokeDasharray="75 742"
                    strokeLinecap="round"
                  />
                  <circle cx="270" cy="140" r="3.5" fill="#00f0ff" filter="url(#glowCyan)" />
                </g>

                {/* Orbiting arc 2: Purple thick with glowing dot, 7s in reverse */}
                <g className={`orbit-group orbit-arc-2 ${isPaused ? 'is-paused' : ''}`}>
                  <circle
                    cx="140"
                    cy="140"
                    r="112"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="3.5"
                    strokeDasharray="95 608"
                    strokeLinecap="round"
                  />
                  <circle cx="252" cy="140" r="4.5" fill="#c084fc" filter="url(#glowPurple)" />
                </g>

                {/* Orbiting arc 3: Pink (#f472b6) thin with glowing dot, 9s */}
                <g className={`orbit-group orbit-arc-3 ${isPaused ? 'is-paused' : ''}`}>
                  <circle
                    cx="140"
                    cy="140"
                    r="82"
                    fill="none"
                    stroke="#f472b6"
                    strokeWidth="1.5"
                    strokeDasharray="55 460"
                    strokeLinecap="round"
                  />
                  <circle cx="222" cy="140" r="3" fill="#f472b6" filter="url(#glowPink)" />
                </g>
              </svg>

              {/* Centered count number with key={count} pop animation */}
              <div className="count-center">
                <span key={count} className="count-number">
                  {count}
                </span>
              </div>
            </div>

            {/* Buttons: PAUSE/RESUME & RESET */}
            <div className="button-group">
              <button
                type="button"
                className="btn-action btn-pause"
                onClick={handleTogglePause}
                aria-label={isPaused ? 'Resume countdown' : 'Pause countdown'}
              >
                {isPaused ? 'RESUME' : 'PAUSE'}
              </button>
              <button
                type="button"
                className="btn-action btn-reset"
                onClick={handleReset}
                aria-label="Reset countdown"
              >
                RESET
              </button>
            </div>
          </div>
        ) : (
          /* END STATE: Full COMING SOON screen */
          <div className="coming-soon-screen">
            <div className="badge-sync">NEURAL SYNC COMPLETE</div>
            <h1 className="heading-coming-soon">
              <span className="text-coming">COMING</span>
              <span className="text-soon">SOON</span>
            </h1>
            <p className="coming-desc">
              System synchronization complete. The next phase is initializing.
            </p>
            <button
              type="button"
              className="btn-reinit"
              onClick={handleReset}
              aria-label="Re-initialize system"
            >
              <svg
                className="reinit-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
              <span>RE-INITIALIZE SYSTEM</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
