const links = [
  {
    label: "Email Abdullah",
    href: "mailto:abdullahasgerali@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 6.5 12 13l9-6.5" fill="none" stroke="#4285f4" strokeWidth="2.2" />
        <path d="M3 6.5v11h18v-11" fill="none" stroke="#34a853" strokeWidth="2.2" />
        <path d="m3 17.5 6-5" fill="none" stroke="#fbbc04" strokeWidth="2.2" />
        <path d="m21 17.5-6-5" fill="none" stroke="#ea4335" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    label: "Abdullah on GitHub",
    href: "https://github.com/uffabdullah",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 .9a11.2 11.2 0 0 0-3.54 21.82c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .1.77 2.45 3.2 1.75.1-.73.4-1.23.7-1.52-2.48-.28-5.09-1.25-5.09-5.52 0-1.22.43-2.22 1.15-3-.12-.28-.5-1.43.1-2.98 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.6 1.55.22 2.7.11 2.98.72.78 1.15 1.78 1.15 3 0 4.28-2.61 5.23-5.1 5.51.4.35.75 1.03.75 2.08v3.1c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .9Z"
        />
      </svg>
    ),
  },
  {
    label: "Abdullah on LinkedIn",
    href: "https://www.linkedin.com/in/abdullahasgerali/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.34 18H5.67V9.4h2.67ZM7 8.22a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1ZM18.34 18h-2.67v-4.18c0-1-.02-2.3-1.4-2.3-1.4 0-1.62 1.09-1.62 2.22V18H9.98V9.4h2.56v1.18h.04a2.8 2.8 0 0 1 2.52-1.39c2.7 0 3.2 1.78 3.2 4.1Z"
        />
      </svg>
    ),
  },
];

export default function SocialLinks({ className = "" }) {
  return (
    <div className={`social-links ${className}`.trim()}>
      {links.map((link) => (
        <a
          key={link.label}
          aria-label={link.label}
          href={link.href}
          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
          rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
