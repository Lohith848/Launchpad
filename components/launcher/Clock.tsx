"use client";

import React, { useState, useEffect } from "react";

export const Clock: React.FC = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <div className="clock-wrap select-none">
        <div className="clock-time" style={{ opacity: 0.3 }}>
          00<span className="clock-colon">:</span>00
          <span className="clock-seconds">00</span>
          <span className="clock-ampm">AM</span>
        </div>
        <div className="clock-date">...</div>
      </div>
    );
  }

  const hours = time.getHours();
  const m = String(time.getMinutes()).padStart(2, "0");
  const s = String(time.getSeconds()).padStart(2, "0");
  const h = String(hours % 12 || 12).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  const dateString = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="clock-wrap select-none">
      <div className="clock-time">
        <span>{h}</span>
        <span className="clock-colon">:</span>
        <span>{m}</span>
        <span className="clock-seconds">{s}</span>
        <span className="clock-ampm">{ampm}</span>
      </div>
      <div className="clock-date">
        {dateString}
      </div>
    </div>
  );
};
