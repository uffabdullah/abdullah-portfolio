import SocialLinks from "../components/SocialLinks";
import ScrollTypewriter from "../components/ScrollTypewriter";

const answers = [
  {
    question: "What do you like to build?",
    answer:
      "I enjoy thoughtful iOS apps, practical AI and machine-learning tools, and products that make complex ideas easier to use.",
  },
  {
    question: "Are you open to opportunities?",
    answer:
      "Yes. I’m open to internships, collaborations, and interesting projects. Send a note through the contact form and tell me a little about it.",
  },
  {
    question: "How do I contact you?",
    answer:
      "Use the message form on the home page or email me directly at abdullahasgerali@gmail.com. I’ll reply to the address you provide.",
  },
  {
    question: "Where can I see your work?",
    answer:
      "The selected-work section links to my projects and GitHub profile. Some are prototypes or works in progress, and their status is labelled on the page.",
  },
  {
    question: "How quickly will you reply?",
    answer:
      "I try to respond within a few days. If something is time-sensitive, mention the deadline in your message.",
  },
  {
    question: "Does the contact form keep a copy of my message?",
    answer:
      "The form sends your message to an email delivery provider and then to my inbox; the portfolio does not keep a separate database copy. Avoid including passwords or sensitive information.",
  },
  {
    question: "Does sending a message cost anything?",
    answer:
      "The form is designed to use an email provider’s free tier for normal personal-site traffic. Provider limits and terms can change, so messages may be temporarily unavailable if that service is not configured or its free allowance is reached.",
  },
];

export const metadata = {
  title: "FAQ — Abdullah Asger Ali",
  description: "Answers about Abdullah's work, collaborations, and getting in touch.",
};

export default function FAQPage() {
  return (
    <main className="faq-page">
      <header className="faq-nav">
        <a className="wordmark" href="/" aria-label="Abdullah Asger Ali, home">
          AA<span> /</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="/#work">Selected work</a>
          <a href="/#contact">Contact</a>
          <a href="/faq" aria-current="page">FAQ</a>
        </nav>
      </header>
      <a className="skip-link" href="#faq-content">Skip to content</a>
      <section className="faq-content" id="faq-content">
        <p className="section-eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</p>
        <h1><ScrollTypewriter text="Good questions." /><br /><em><ScrollTypewriter text="Clear answers." /></em></h1>
        <div className="faq-list">
          {answers.map((item, index) => (
            <details className="faq-item" key={item.question}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <ScrollTypewriter text={item.question} />
                <i aria-hidden="true">+</i>
              </summary>
              <p><ScrollTypewriter text={item.answer} /></p>
            </details>
          ))}
        </div>
        <a className="contact-link" href="/#contact">
          Still have a question? Send me a note <span aria-hidden="true">↗</span>
        </a>
      </section>
      <footer className="site-footer faq-footer">
        <span>© 2026 ABDULLAH ASGER ALI</span>
        <SocialLinks />
        <a href="/">BACK TO HOME ↑</a>
      </footer>
    </main>
  );
}
