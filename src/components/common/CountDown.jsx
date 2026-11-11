import { useEffect, useRef, useState } from "react";

// e.g. "1d 2h 3m 4s"
function formatRemaining(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (days || hours) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(" ");
}

function CountDown({ startsAt, endsAt, onEnd }) {
  const [mountedAt] = useState(() => Date.now());
  const [now, setNow] = useState(mountedAt);
  const endNotified = useRef(false);

  const start = startsAt ? new Date(startsAt).getTime() : null;
  const end = endsAt ? new Date(endsAt).getTime() : null;

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Call onEnd once when the clock runs out while the page is open.
  // If the auction was already over when the page loaded (mountedAt >= end), onEnd is not called.
  useEffect(() => {
    if (end != null && mountedAt < end && now >= end && !endNotified.current) {
      endNotified.current = true;
      if (onEnd) Promise.resolve(onEnd()).catch((err) => console.log(err));
    }
  }, [now, end, mountedAt, onEnd]);

  if (end == null || Number.isNaN(end)) return <p>No end time set</p>;

  if (start != null && now < start) {
    return <p>Starts in: {formatRemaining(start - now)}</p>;
  }

  if (now < end) {
    return <p>Ends in: {formatRemaining(end - now)}</p>;
  }

  return <p>Auction ended</p>;
}

export default CountDown;
