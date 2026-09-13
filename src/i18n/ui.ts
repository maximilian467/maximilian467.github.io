export type Locale = 'de' | 'en';
export const ui = {
  de: {
    projects: 'Projekte', now: 'Gerade dran', about: 'Über mich', skills: 'Womit ich arbeite',
    contact: 'Kontakt', hackathons: 'Hackathons', skip: 'Zum Inhalt', home: 'Zur Startseite',
    cv: 'Lebenslauf (PDF)', code: 'Code ansehen', legal: 'Impressum', privacy: 'Datenschutz',
    built: 'Gebaut mit Astro und KI-Agenten', nudge: 'Anstupsen', pause: 'Pausieren', play: 'Abspielen',
    step: 'Schritt', figure: 'CartPole-Simulation: Ein Wagen balanciert einen aufrechten Stab.',
    nudgeLabel: 'CartPole-Stab anstupsen', loading: 'Simulation wird geladen…',
    unavailable: 'Die Simulation konnte nicht geladen werden. Lade die Seite erneut.',
    staticFigure: 'Statische Ansicht. Für die Simulation JavaScript aktivieren.',
    datasheet: 'Messwerte für Wächter', firstWord: 'Zeit bis zum ersten gesprochenen Wort',
    asOf: 'Stand Sept. 2026', running: 'läuft', notFound: 'Diese Seite gibt es nicht.',
    notFoundText: 'Auf der Startseite findest du meine Projekte und Kontaktmöglichkeiten.',
    description: 'Dualer Student Automatisierungstechnik bei KUKA. Projekte mit KI-Agenten, Robotik und Automatisierung.',
  },
  en: {
    projects: 'Projects', now: 'Now', about: 'About me', skills: 'What I work with',
    contact: 'Contact', hackathons: 'Hackathons', skip: 'Skip to content', home: 'Back to home',
    cv: 'CV (PDF)', code: 'View code', legal: 'Legal notice', privacy: 'Privacy',
    built: 'Built with Astro and AI agents', nudge: 'Nudge', pause: 'Pause', play: 'Play',
    step: 'Step', figure: 'CartPole simulation: a cart balances an upright pole.',
    nudgeLabel: 'Nudge the CartPole pole', loading: 'Loading simulation…',
    unavailable: 'The simulation could not load. Reload the page to try again.',
    staticFigure: 'Static view. Enable JavaScript to run the simulation.',
    datasheet: 'Wächter measurements', firstWord: 'Time to first spoken word',
    asOf: 'As of Sept. 2026', running: 'in progress', notFound: 'This page does not exist.',
    notFoundText: 'You can find my projects and contact details on the home page.',
    description: 'Automation engineering student at KUKA. Projects with AI agents, robotics and automation.',
  },
} as const;
export const links = {
  github: 'https://github.com/maximilian467',
  linkedin: 'https://www.linkedin.com/in/maximilian-k%C3%B6hlenbeck',
  email: 'mailto:m.koehlenbeck@koehlenbeck.com',
  cv: '/cv/maximilian-koehlenbeck-lebenslauf.pdf',
};
