import { Link } from 'react-router-dom';
import { Compass, Instagram, Mail } from 'lucide-react';

const currentYear = new Date().getFullYear();

const linkGroups = [
  {
    title: 'Entdecken',
    links: [
      { to: '/inspiration', label: 'Inspiration' },
      { to: '/guides', label: 'Guides' },
      { to: '/blog', label: 'Blog' },
      { to: '/tipps', label: 'Reisetipps' },
    ],
  },
  {
    title: 'Planen',
    links: [
      { to: '/planner', label: 'Weltreise-Planer' },
      { to: '/profile', label: 'Mein Profil' },
    ],
  },
  {
    title: 'Rechtliches',
    links: [
      { to: '/impressum', label: 'Impressum' },
      { to: '/datenschutz', label: 'Datenschutz' },
      { to: '/kontakt', label: 'Kontakt' },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-border bg-muted/40">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
                <Compass className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold">GlobeDetour</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Dein digitaler Begleiter, um Reisen zu träumen, zu planen und zu erleben.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="mailto:hallo@globedetour.app"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="E-Mail"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} GlobeDetour. Alle Rechte vorbehalten.</p>
          <p className="text-xs">Mit Fernweh gebaut für Reisende aller Generationen.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
