const uiIconMap = {
  network: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 18.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-5.9-5.1 1.4 1.4A6.3 6.3 0 0 1 12 12c1.8 0 3.5.7 4.8 1.9l1.4-1.4A8.3 8.3 0 0 0 12 10.2a8.3 8.3 0 0 0-5.9 2.5zm-3-3 1.4 1.4A10.5 10.5 0 0 1 12 7.2c2.9 0 5.6 1.1 7.6 3.1l1.4-1.4A12.4 12.4 0 0 0 12 5.2 12.4 12.4 0 0 0 3.1 9.4zm-3-3 1.4 1.4A14.6 14.6 0 0 1 12 2.2c4 0 7.7 1.5 10.5 4.3L24 5.1A16.6 16.6 0 0 0 12 0a16.6 16.6 0 0 0-11.9 5.1z" />
    </svg>
  ),
  lightning: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2 6 13h4l-1 9 9-13h-4l-1-7z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2 4 6v6c0 5.2 3.7 9.7 8 10 4.3-.3 8-4.8 8-10V6l-8-4zm-1 12.2-2.6-2.6L7 13l4 4 6-6-1.4-1.4L11 14.2z" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5c5.5 0 9.7 4.1 11 7-1.3 2.9-5.5 7-11 7S2.3 14.9 1 12c1.3-2.9 5.5-7 11-7zm0 2C8 7 4.7 9.4 3.1 12 4.7 14.6 8 17 12 17s7.3-2.4 8.9-5C19.3 9.4 16 7 12 7zm0 2.2A2.8 2.8 0 1 1 12 15a2.8 2.8 0 0 1 0-5.8z" />
    </svg>
  ),
  arrowLeft: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.7 5.3 8 12l6.7 6.7 1.4-1.4L10.8 12l5.3-5.3-1.4-1.4z" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9.3 5.3 6.7 6.7-6.7 6.7-1.4-1.4 5.3-5.3-5.3-5.3 1.4-1.4z" />
    </svg>
  ),
  mobile: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm4 16.25a1.25 1.25 0 1 0 0 .01V19.25zM9 6h6v10H9V6z" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a5 5 0 0 1 5 5v2h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5zm3 7V7a3 3 0 0 0-6 0v2h6zm-3 3a2 2 0 0 1 1 3.73V18h-2v-2.27A2 2 0 0 1 12 12z" />
    </svg>
  ),
  otp: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 1 1-7.07 2.93A10 10 0 0 1 12 2zm1 5h-2v6l5 3 1-1.73-4-2.27V7z" />
    </svg>
  ),
  shieldCheck: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l8 4v6c0 5.25-3.67 9.76-8 10-4.33-.24-8-4.75-8-10V6l8-4zm-1 12.17-2.59-2.58L7 13l4 4 6-6-1.41-1.41L11 14.17z" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2l-2 6h4l-6 14 2-8H7l6-12z" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.65 6.35A7.95 7.95 0 0 0 12 4V1L7 6l5 5V7a5 5 0 1 1-4.9 6H5.02A7 7 0 1 0 17.65 6.35z" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 5h2v14h-2zM5 11h14v2H5z" />
    </svg>
  ),
  drden: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.3 4.2c2.3 0 4.3 1.3 5.2 3.4.5 1.1.3 2.4-.4 3.3-.6.8-1.4 1.2-2.4 1.2h-2.1c-1.2 0-2 .5-2.5 1.5-.4.8-.6 1.8-.6 2.9V20H7.9v-3.7c0-1.5.3-2.9 1-4.1 1-1.7 2.5-2.6 4.6-2.6h1.8c.5 0 .8-.1 1-.4.2-.3.2-.7 0-1.1-.5-1.2-1.7-1.9-3-1.9-1.6 0-2.9.8-3.8 2.3L7.3 7.1c1.4-1.9 3.5-2.9 6-2.9z" />
    </svg>
  )
};

function UiGlyph({ type }) {
  return <span className="ui-glyph">{uiIconMap[type]}</span>;
}

export default UiGlyph;
