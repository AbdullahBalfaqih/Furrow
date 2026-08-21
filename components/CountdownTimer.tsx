'use client';

import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ darkTheme = true }: { darkTheme?: boolean }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 136,
    hours: 21,
    minutes: 18,
    seconds: 34,
  });

  useEffect(() => {
    const targetDate = new Date().getTime() + (136 * 24 * 60 * 60 * 1000) + (21 * 60 * 60 * 1000) + (18 * 60 * 1000) + (34 * 1000);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timerItems = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '8px 0',
      }}
    >
      {timerItems.map((item) => (
        <div
          key={item.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '60px',
          }}
        >
          <span
            key={item.value}
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '28px',
              fontWeight: 700,
              color: darkTheme ? '#FFFFFF' : '#121212',
              lineHeight: '1',
              letterSpacing: '-0.5px',
              textAlign: 'center',
            }}
          >
            {String(item.value).padStart(2, '0')}
          </span>

          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '11px',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: darkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(18, 18, 18, 0.5)',
              marginTop: '6px',
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
