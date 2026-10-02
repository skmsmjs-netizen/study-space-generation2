/** Quiet, static foreground for the seated observatory view (960 × 68). */
export function ObservatoryDesk() {
  return (
    <g className="obs-desk-objects" pointerEvents="none">
      <g className="obs-desk-left">
        <path d="M66 30h119v2h16v3h-14v2H82v-2H66z" className="obs-desk-shadow" />
        <path d="M69 13l57-7 9 7 53-7 13 23-65 10-57-8z" className="obs-desk-wood" />
        <path d="M72 13l53-6 8 7v21l-54-7z" className="obs-desk-paper" />
        <path d="M135 14l52-7 11 21-63 7z" className="obs-desk-paper" />
        <path
          d="M80 30l52 7v1l-52-7zM136 37l62-9v2l-62 9z"
          className="obs-desk-paper"
          opacity=".55"
        />
        <path d="M132 14h2v21h-2zM127 9l4 5h-1l-4-5z" className="obs-desk-ink" opacity=".4" />
        <path
          d="M87 23l12-9 .6 .8-11 8.2 21 2-.1 1-22-2zM100 14l9 11 11-7 .5 .8-12 7.5-9.3-11.6z"
          className="obs-desk-ink"
          opacity=".32"
        />
        <path
          d="M86 22h2v2h-2M98 13h2v2h-2M108 24h2v2h-2M119 17h2v2h-2M93 27h1v1h-1M114 11h1v1h-1"
          className="obs-desk-ink"
        />
        <path
          d="M148 16l27-4 .2 1-27 4zM150 20l31-4 .2 1-31 4zM153 24l24-3 .2 1-24 3zM155 28l17-2 .2 1-17 2z"
          className="obs-desk-ink"
          opacity=".25"
        />
        <path
          d="M104 20h1v1h-1M167 10h1v1h-1M136 15h1v16h-1"
          className="obs-desk-light"
          opacity=".5"
        />
        <path d="M196 12l4-1 8 23-2 5-3-4z" className="obs-desk-wood" />
        <path d="M197 13h1l7 21h-1zM196 11l3-1 1 3-3 1z" className="obs-desk-brass" />
        <path d="M204 35l2 4 1-3z" className="obs-desk-ink" />
      </g>
      <g className="obs-desk-right">
        <path d="M769 40h39v2h-39M802 40h39v2h-39M860 39h35v2h-35" className="obs-desk-shadow" />
        <path d="M772 32h28l5 4v4h-33z" className="obs-desk-wood" />
        <path d="M774 34h25l4 3v1h-29z" className="obs-desk-paper" />
        <path d="M773 32h3v8h-3M780 36h18v1h-18" className="obs-desk-ink" opacity=".4" />
        <path d="M801 13h34l10 23h-54z" className="obs-desk-light" opacity=".075" />
        <path d="M818 12h3v24h-3M813 34h13v2h-13" className="obs-desk-brass" />
        <path d="M821 14h1v20h-1M816 33h2v2h-2" className="obs-desk-ink" opacity=".35" />
        <path d="M808 36h23v1h5v3h-33v-3h5z" className="obs-desk-brass" />
        <path d="M809 36h21v1h-21M817 17h1v15h-1" className="obs-desk-light" opacity=".45" />
        <path d="M812 1h13v2h4v3h3v4h4v4h-36v-4h4V6h3V3h5z" className="obs-desk-brass" />
        <path d="M800 13h36v2h-36M812 1h13v1h-13" className="obs-desk-ink" opacity=".45" />
        <path
          d="M805 11h26v1h-26M815 15h8v2h-8M813 3h10v1h-10"
          className="obs-desk-light"
          opacity=".7"
        />
        <path d="M883 25h8v2h2v7h-2v2h-8v-3h6v-5h-6z" className="obs-desk-paper" />
        <path d="M864 22h20v14h-2v3h-15v-3h-2z" className="obs-desk-paper" />
        <path d="M866 23h16v3h-16z" className="obs-desk-ink" opacity=".75" />
        <path
          d="M864 22h20v1h-20M865 25h1v10h-1M867 37h13v1h-13"
          className="obs-desk-light"
          opacity=".55"
        />
        <path d="M882 27h2v9h-2v2h-3v-2h3z" className="obs-desk-shadow" opacity=".28" />
      </g>
    </g>
  );
}
