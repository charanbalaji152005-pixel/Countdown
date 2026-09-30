import { useEffect, useState } from "react";
import "../componenets/Count.css";

function Countdown() {
  const [time, setTime] = useState(10);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || time <= 0) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, time]);

  const resetTimer = () => {
    setTime(10);
    setIsPaused(false);
  };

  const togglePause = () => {
    if (time === 0) {
      setTime(10);
      setIsPaused(false);
      return;
    }

    setIsPaused((prev) => !prev);
  };

  /*
    10 seconds = 360 degrees
    Every second = 36 degrees

    10  = 360°
    9   = 324°
    8   = 288°
    ...
    1   = 36°
    0   = 0°
  */

  const progress = (time / 10) * 360;

  return (
    <div className="countdown-title">
      {/* ==============================
          TITLE PARENT
      ============================== */}

      <header>
        <h1>LOADER COUNTDOWN</h1>
        <p>NEURAL TIMER SUBSYSTEM</p>
      </header>

      {/* ==============================
          CONTENT PARENT
      ============================== */}

      <main className="countdown-content">
        {/* GLOWING CIRCLE */}

        <div
          className="timer-circle"
          style={{
            "--progress": `${progress}deg`,
          }}
        >
          {/* FIVE CIRCULAR LINES */}
          <div className="circle-line circle-one"></div>
          <div className="circle-line circle-two"></div>
          <div className="circle-line circle-three"></div>
          <div className="circle-line circle-four"></div>
          <div className="circle-line circle-five"></div>

          {/* THICK COUNTDOWN LINE */}
          <div
            className="progress-ring"
            style={{
              "--progress": `${progress}deg`,
            }}
          ></div>

          {/* MOVING PROGRESS BALL */}
          <div
            className="progress-ball"
            style={{
              transform: `rotate(${progress - 90}deg)`,
            }}
          >
            <span></span>
          </div>

          {/* EXTRA PULSING BALLS */}
          <div className="glow-ball ball-one"></div>
          <div className="glow-ball ball-two"></div>
          <div className="glow-ball ball-three"></div>

          {/* CENTER */}
          <div
            className="timer-center"
            style={{
              transform: `scale(${0.72 + (time / 10) * 0.28})`,
            }}
          >
            <div className="time-number">{time}</div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="controls">
          <button className="pause-button" onClick={togglePause}>
            {time === 0 ? "RESTART" : isPaused ? "RESUME" : "PAUSE"}
          </button>

          <button className="reset-button" onClick={resetTimer}>
            RESET
          </button>
        </div>

        {/* SYSTEM STATUS */}
      </main>
    </div>
  );
}

export default Countdown;