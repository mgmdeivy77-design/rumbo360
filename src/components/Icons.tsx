import React from "react";

const ICN: Record<string, string> = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-5.5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5V20"/>',
  week: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v3.5M16 3v3.5"/><path d="m8.5 15 2.2 2.2 4.8-4.5"/>',
  library: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15.5H5.5C4.7 19.5 4 18.8 4 18z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v15.5h5.5c.8 0 1.5-.7 1.5-1.5z"/><path d="M15.5 4v5.5l1.5-1 1.5 1V4"/>',
  chart: '<path d="M4 20.5h16"/><path d="M6.5 20.5v-5M12 20.5v-9M17.5 20.5V8"/><path d="m6.5 11.5 5-4 3.5 2 3-4.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.4 5.6L8 16l2.4-5.6z"/><circle cx="12" cy="12" r="1"/><path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21"/>',
  bible: '<path d="M4.5 5.5A1.5 1.5 0 0 1 6 4h5.5v15.5H6a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M19.5 5.5A1.5 1.5 0 0 0 18 4h-5.5v15.5H18a1.5 1.5 0 0 0 1.5-1.5z"/><path d="M8 8.5v4M6.5 10h3M15.2 9h2.6M15.2 12.5h2.6M15 4v5l1.3-.9 1.3.9V4"/>',
  notebook: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 8h7M9 12h7M9 16h4"/>',
  weather: '<circle cx="10.5" cy="9" r="3.2"/><path d="M10.5 2.8v1.4M10.5 13.8v.4M4.3 9h1.4M6.1 4.6l1 1M14.9 4.6l-1 1"/><path d="M7.5 19.5h9a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.5 13.5a3 3 0 0 0 0 6z"/>',
  mood: '<path d="M12 21a9 9 0 1 1 6.7-15"/><circle cx="9" cy="10.2" r=".8" fill="currentColor"/><circle cx="15" cy="10.2" r=".8" fill="currentColor"/><path d="M8.5 14.3c1 1.5 2.2 2.2 3.5 2.2s2.5-.7 3.5-2.2"/><path d="M18.5 3.5c.8-.8 2-.8 2.6 0 .6.8.3 2-2.6 4-2.9-2-3.2-3.2-2.6-4 .6-.8 1.8-.8 2.6 0z" fill="currentColor" stroke="none"/>',
  wheel: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2"/><path d="M12 3v4.5M12 16.5V21M3 12h4.5M16.5 12H21M5.6 5.6l3.2 3.2M15.2 15.2l3.2 3.2M18.4 5.6l-3.2 3.2M8.8 15.2l-3.2 3.2"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',
  moon: '<path d="M19.5 14.2A7.8 7.8 0 1 1 9.8 4.5a6.3 6.3 0 0 0 9.7 9.7z"/><path d="M16.5 4.5v2M15.5 5.5h2M19.5 8v1.5M18.8 8.7h1.5"/>',
  users: '<circle cx="9" cy="8.5" r="3"/><path d="M3 19c.6-3 3-4.7 6-4.7s5.4 1.7 6 4.7"/><circle cx="17" cy="9.5" r="2.4"/><path d="M16.5 14.5c2.4 0 4.1 1.3 4.5 3.7"/>',
  flask: '<path d="M9 3h6M10 3v5.8L5.2 17.5A2 2 0 0 0 7 20.5h10a2 2 0 0 0 1.8-3L14 8.8V3"/><path d="M7.5 15.5h9"/>',
  wave: '<path d="M3 10.5c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0"/><path d="M3 15.5c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0"/>',
  lotus: '<path d="M12 20c-4.8 0-8-3.2-8-8.5 4.8 0 8 2.4 8 8.5z"/><path d="M12 20c4.8 0 8-3.2 8-8.5-4.8 0-8 2.4-8 8.5z"/><path d="M12 20c-2.5-3-2.8-7.5 0-12.5 2.8 5 2.5 9.5 0 12.5z"/>',
  self: '<path d="M12 3.5c2.5 3 4 5.8 4 8.5a4 4 0 0 1-8 0c0-2.7 1.5-5.5 4-8.5z"/><path d="M12 20.5v-4.5"/><path d="M7 18.5c1.5-1 3.2-1.5 5-1.5s3.5.5 5 1.5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  file: '<path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M14 3.5v4h4M9 12h6M9 16h6"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  briefcase: '<rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M9 7.5V5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3.5 13h17"/>',
  cap: '<path d="m2.5 9.5 9.5-4.5 9.5 4.5-9.5 4.5z"/><path d="M6.5 11.5V16c1.5 1.5 3.4 2.2 5.5 2.2s4-.7 5.5-2.2v-4.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  quote: '<path d="M10 7.5H6.5C5.7 7.5 5 8.2 5 9v4.5h4.5V17M19 7.5h-3.5c-.8 0-1.5.7-1.5 1.5v4.5h4.5V17"/>',
  chat: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4 4v-4H5.5A1.5 1.5 0 0 1 4 14.5z"/>',
  repeat: '<path d="M4 12a6 6 0 0 1 6-6h8M18 3l3 3-3 3M20 12a6 6 0 0 1-6 6H6M6 21l-3-3 3-3"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
  leaf: '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19c2-4 5-7 9-9"/>',
  scale: '<path d="M12 4v16M6 20h12M5 8h14"/><path d="M7.5 8 4.5 14a3 3 0 0 0 6 0zM16.5 8l-3 6a3 3 0 0 0 6 0z"/>',
  face1: '<circle cx="12" cy="12" r="9"/><path d="M8.2 9.2 10.4 10.2M15.8 9.2 13.6 10.2"/><circle cx="9.2" cy="11.2" r=".7" fill="currentColor"/><circle cx="14.8" cy="11.2" r=".7" fill="currentColor"/><path d="M8.5 16.5c1-1.7 2.2-2.4 3.5-2.4s2.5.7 3.5 2.4"/>',
  face2: '<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10.2" r=".8" fill="currentColor"/><circle cx="15" cy="10.2" r=".8" fill="currentColor"/><path d="M8.8 16c.9-1.2 2-1.8 3.2-1.8s2.3.6 3.2 1.8"/>',
  face3: '<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10.2" r=".8" fill="currentColor"/><circle cx="15" cy="10.2" r=".8" fill="currentColor"/><path d="M9 15h6"/>',
  face4: '<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r=".8" fill="currentColor"/><circle cx="15" cy="10" r=".8" fill="currentColor"/><path d="M8.8 14.3c.9 1.4 2 2 3.2 2s2.3-.6 3.2-2"/>',
  face5: '<circle cx="12" cy="12" r="9"/><path d="M8 10.3c.5-.8 1.5-.8 2 0M14 10.3c.5-.8 1.5-.8 2 0"/><path d="M8.2 13.8c1 2 2.3 2.9 3.8 2.9s2.8-.9 3.8-2.9z"/>',
  storm: '<path d="M7 15a4 4 0 0 1 .5-8A5.5 5.5 0 0 1 18 8.5 3.5 3.5 0 0 1 17.5 15"/><path d="m12.5 11-2.5 5h3l-1.5 4.5"/>',
  rain: '<path d="M7 14.5a4 4 0 0 1 .5-8A5.5 5.5 0 0 1 18 8a3.5 3.5 0 0 1-.5 6.5"/><path d="M9 17.5l-1 2.5M13 17.5l-1 2.5M17 17.5l-1 2.5"/>',
  cloud: '<path d="M7 18a4.5 4.5 0 0 1 .5-9A6 6 0 0 1 19 10.5 3.8 3.8 0 0 1 18 18z"/>',
  partly: '<circle cx="8.5" cy="8.5" r="3"/><path d="M8.5 2.5v1.5M2.5 8.5H4M4.3 4.3l1 1M12.7 4.3l-1 1"/><path d="M9 20h8.5a3.5 3.5 0 0 0 .3-7A5 5 0 0 0 9 14.5 2.8 2.8 0 0 0 9 20z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/>',
  book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
};

export const Ico: React.FC<{ name: string; className?: string }> = ({ name, className = "" }) => (
  <svg
    className={`ico ${className}`}
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ verticalAlign: "-.125em" }}
    dangerouslySetInnerHTML={{ __html: ICN[name] || "" }}
  />
);

export const CoachHero: React.FC = () => (
  <svg viewBox="0 0 360 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="hs" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1E3A5F" />
        <stop offset="1" stopColor="#F0B35A" />
      </linearGradient>
    </defs>
    <rect width="360" height="150" fill="url(#hs)" />
    <circle cx="270" cy="98" r="26" fill="#FFE29A" opacity=".9" />
    <path d="M0 112Q45 100 90 112T180 112T270 112T360 112V150H0Z" fill="#1F6F78" />
    <path d="M0 128Q45 118 90 128T180 128T270 128T360 128V150H0Z" fill="#14504F" />
    <g transform="translate(110 38)">
      <path d="M10 74 18 12h14l8 62z" fill="#F8FAFC" />
      <rect x="16" y="30" width="18" height="8" fill="#D9683B" />
      <rect x="14" y="50" width="22" height="8" fill="#D9683B" />
      <rect x="14" y="4" width="22" height="9" fill="#334155" />
      <path d="M25 0l10 4H15z" fill="#334155" />
      <path d="M40 8 130 -8 130 26z" fill="#FFF2B3" opacity=".35" />
    </g>
  </svg>
);
