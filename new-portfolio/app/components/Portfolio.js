"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SocialLinks from "./SocialLinks";
import ScrollTypewriter from "./ScrollTypewriter";

const DeviceScene = dynamic(() => import("./DeviceScene"), {
  ssr: false,
  loading: () => null,
});

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    number: "01",
    name: "CrowdOfOne",
    category: "AI / PRODUCT",
    description:
      "A synthetic audience simulator that turns a pitch or product page into feedback on objections, confusion, and purchase intent.",
    stack: "React · TypeScript · Three.js",
    status: "Working prototype",
    href: "https://github.com/uffabdullah/crowdofone",
    className: "crowd",
  },
  {
    number: "02",
    name: "CounterfeitTrace",
    category: "GRAPH INTELLIGENCE",
    description:
      "A graph intelligence system that identifies unusual supply-chain transactions and exposes counterfeit entry points.",
    stack: "PyTorch Geometric · React · Supabase",
    status: "Prototype",
    href: "https://github.com/uffabdullah/forge-ai",
    className: "trace",
  },
  {
    number: "03",
    name: "ProxyProof",
    category: "WEB / ATTENDANCE",
    description:
      "A Bluetooth and location-aware attendance platform designed to prevent proxy attendance with proximity tokens and approved devices.",
    stack: "Next.js · Supabase · Bluetooth",
    status: "Shipped",
    href: "https://github.com/uffabdullah",
    className: "proxy",
  },
  {
    number: "04",
    name: "Chip In",
    category: "IOS / SWIFT STUDENT CHALLENGE",
    description:
      "A SwiftUI concept for splitting shared expenses with a clear, thoughtful mobile experience.",
    stack: "Swift · SwiftUI",
    status: "In progress",
    href: "https://github.com/uffabdullah",
    className: "chip",
  },
];

export default function Portfolio() {
  const contactStartedAt = useRef(Date.now());
  const [contactStatus, setContactStatus] = useState("idle");
  const [contactError, setContactError] = useState("");
  const [contactFallback, setContactFallback] = useState("");

  const submitContactForm = async (event) => {
    event.preventDefault();
    setContactStatus("sending");
    setContactError("");
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    const subject = `Portfolio message from ${body.name}`;
    const mailBody = `Name: ${body.name}\nEmail: ${body.email}\n\n${body.message}`;
    setContactFallback(
      `mailto:abdullahasgerali@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`
    );

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Message could not be sent.");
      form.reset();
      contactStartedAt.current = Date.now();
      setContactStatus("sent");
      setContactFallback("");
    } catch (error) {
      setContactStatus("error");
      setContactError(error.message || "Message could not be sent. Please try again.");
    }
  };

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      duration: 0.82,
      smoothWheel: !reducedMotion,
      syncTouch: false,
    });
    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);

    const context = gsap.context(() => {
      if (!reducedMotion) {
        gsap.from(".nav-shell", {
          y: -24,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
        gsap.from(".hero .eyebrow, .hero-title, .hero-role, .hero-summary, .hero .text-link", {
          y: 22,
          opacity: 0,
          duration: 0.8,
          stagger: 0.09,
          delay: 0.12,
          ease: "power3.out",
        });
        gsap.utils.toArray(".reveal").forEach((element, index) => {
          gsap.from(element, {
            y: 30,
            opacity: 0,
            duration: 0.82,
            delay: (index % 3) * 0.05,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 91%", once: true },
          });
        });
      }
    });
    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      context.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <DeviceScene />
      <div className="ambient-grain" aria-hidden="true" />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="nav-shell">
        <a className="wordmark" href="#top" aria-label="Abdullah Asger Ali, home">
          AA<span> /</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#work">Selected work</a>
          <a href="#journey">Journey</a>
          <a href="/faq">FAQ</a>
        </nav>
        <a className="nav-contact" href="#contact">
          Let&apos;s talk <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main id="main-content">
        <section className="section hero" id="top" data-scene-cue="01">
          <div className="hero-copy">
            <p className="eyebrow"><span className="signal-dot" /> VELLORE, INDIA <span className="eyebrow-separator">/</span> OPEN TO OPPORTUNITIES</p>
            <h1 className="hero-title">
              <ScrollTypewriter text="Abdullah" />
              <span><ScrollTypewriter text="Asger " /><em><ScrollTypewriter text="Ali." /></em></span>
            </h1>
            <p className="hero-role"><ScrollTypewriter text="iOS developer · AI / ML engineer · student" /></p>
            <p className="hero-summary">
              <ScrollTypewriter text="I build thoughtful iOS experiences and AI-powered systems for people solving real problems." />
            </p>
            <a className="text-link" href="#work">Explore selected work <span aria-hidden="true">↓</span></a>
          </div>

          <span className="scroll-cue"><i /> SCROLL TO INSPECT</span>
          <span className="hero-index">01 <i>/</i> 05</span>
        </section>

        <section className="section about-section" id="about" data-scene-cue="02">
          <div className="section-topline reveal">
            <span>01 — A LITTLE ABOUT ME</span>
            <span>THE BUILDER BEHIND THE SCREEN</span>
          </div>
          <div className="about-heading reveal">
            <p className="section-eyebrow">CURIOUS BY NATURE. BUILT BY PRACTICE.</p>
            <h2><ScrollTypewriter text="Make it useful." /><br /><em><ScrollTypewriter text="Make it matter." /></em></h2>
          </div>
          <div className="about-grid">
            <div className="portrait-card reveal">
              <img src="/abdullahgoated.jpg" alt="Portrait of Abdullah Asger Ali" />
              <div><span>ABDULLAH ASGER ALI</span><small>DESIGNER · DEVELOPER · BUILDER</small></div>
            </div>
            <div className="about-copy reveal">
              <p>
                <ScrollTypewriter text="I'm an 18-year-old B.Tech. Computer Science and Engineering student specialising in Data Science at VIT Vellore, originally from Hyderabad." />
              </p>
              <p>
                <ScrollTypewriter text="I work at the intersection of " /><strong><ScrollTypewriter text="Apple experiences, artificial intelligence, and machine learning" /></strong><ScrollTypewriter text=". My approach is practical: understand a real problem, test assumptions, and turn them into a working product." />
              </p>
              <p>
                <ScrollTypewriter text="Outside code, I represented Tamil Nadu in running in 2023, enjoy badminton, volleyball and football, and spoke at The Hindu's Sportstar South Sports Conclave." />
              </p>
            </div>
          </div>
          <div className="callout-grid reveal">
            <article>
              <span>01 / APPROACH</span>
              <h3><ScrollTypewriter text="Start with the problem." /></h3>
              <p><ScrollTypewriter text="Build from real needs, make an early version tangible, and keep learning from what happens next." /></p>
            </article>
            <article>
              <span>02 / INTEREST</span>
              <h3><ScrollTypewriter text="Explore the edges." /></h3>
              <p><ScrollTypewriter text="From SwiftUI interfaces to AI simulations and graph intelligence, I enjoy turning complex ideas into useful tools." /></p>
            </article>
          </div>
        </section>

        <section className="section work-section" id="work" data-scene-cue="03">
          <div className="section-topline reveal">
            <span>02 — SELECTED WORK</span>
            <span>IDEAS, MADE REAL</span>
          </div>
          <div className="work-heading reveal">
            <p className="section-eyebrow">A FEW THINGS I&apos;VE BEEN BUILDING</p>
            <h2><ScrollTypewriter text="Build. Test." /><br /><em><ScrollTypewriter text="Learn. Repeat." /></em></h2>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <article className={`project-row ${project.className} reveal`} key={project.number}>
                <span className="project-number">{project.number}</span>
                <div className="project-main">
                  <p className="project-category">{project.category}</p>
                  <h3><a href={project.href} target="_blank" rel="noreferrer"><ScrollTypewriter text={project.name} /><span aria-hidden="true"> ↗</span></a></h3>
                  <p className="project-description"><ScrollTypewriter text={project.description} /></p>
                  <div className="project-stack">{project.stack.split(" · ").map((item) => <span key={item}>{item}</span>)}</div>
                </div>
                <div className="project-status"><span>{project.status}</span><i /></div>
              </article>
            ))}
          </div>
        </section>

        <section className="section journey-section" id="journey" data-scene-cue="04">
          <div className="section-topline reveal">
            <span>03 — THE JOURNEY</span>
            <span>STILL IN MOTION</span>
          </div>
          <div className="journey-grid">
            <div className="journey-intro reveal">
              <p className="section-eyebrow">CURRENTLY LEARNING</p>
              <h2><ScrollTypewriter text="Stay curious." /><br /><em><ScrollTypewriter text="Keep going." /></em></h2>
              <p>
                <ScrollTypewriter text="Studying Global Consumer Intelligence at the Matsuo-Iwasawa Laboratory, The University of Tokyo, while strengthening my foundations in AI and iOS development." />
              </p>
            </div>
            <div className="timeline">
              <article className="timeline-row reveal"><span>2023</span><div><h3><ScrollTypewriter text="Competitive discipline" /></h3><p><ScrollTypewriter text="Represented Tamil Nadu in running and spoke at the Sportstar South Sports Conclave by The Hindu." /></p></div></article>
              <article className="timeline-row reveal"><span>2026</span><div><h3><ScrollTypewriter text="Building under pressure" /></h3><p><ScrollTypewriter text="Built CrowdOfOne at the Neubius × NVIDIA Global AI Hackathon and CounterfeitTrace for ForgeAI at Gravitas '26." /></p></div></article>
              <article className="timeline-row reveal"><span>NOW</span><div><h3><ScrollTypewriter text="Going deeper" /></h3><p><ScrollTypewriter text="Learning through GCI World, strengthening core programming skills, and developing iOS products." /></p></div></article>
            </div>
          </div>
          <div className="toolkit reveal" aria-label="Technologies and tools">
            <span>Python</span><span>Swift</span><span>SwiftUI</span><span>PyTorch</span><span>React</span><span>TypeScript</span><span>Three.js</span><span>Supabase</span><span>GSAP</span><span>Git</span>
          </div>
        </section>

        <section className="section contact-section" id="contact" data-scene-cue="05">
          <div className="section-topline reveal">
            <span>04 — THE NEXT CHAPTER</span>
            <span>AVAILABLE FOR OPPORTUNITIES</span>
          </div>
          <div className="contact-content reveal">
            <p className="section-eyebrow">HAVE A GOOD PROBLEM?</p>
            <h2><ScrollTypewriter text="Tell me what" /><br /><em><ScrollTypewriter text="you're building." /></em></h2>
            <div className="contact-grid">
              <p className="contact-intro">
                <ScrollTypewriter text="Have an idea, a project, or a question? Send me a note here and I'll get back to you by email." />
              </p>
              <form className="contact-form" onSubmit={submitContactForm}>
                <label>
                  Your name
                  <input name="name" autoComplete="name" required minLength={2} maxLength={80} />
                </label>
                <label>
                  Your email
                  <input name="email" type="email" autoComplete="email" required maxLength={254} />
                </label>
                <label>
                  What&apos;s on your mind?
                  <textarea name="message" rows={5} required minLength={10} maxLength={5000} />
                </label>
                <div className="contact-honeypot" aria-hidden="true">
                  <label>
                    Leave this field empty
                    <input name="website_url" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <input type="hidden" name="loaded_at" value={contactStartedAt.current} />
                <button className="contact-submit" type="submit" disabled={contactStatus === "sending"}>
                  {contactStatus === "sending" ? "Sending…" : "Send message"}
                  <span aria-hidden="true">↗</span>
                </button>
                <p className="form-feedback" role="status" aria-live="polite">
                  {contactStatus === "sent" && "Thanks — your message is on its way."}
                  {contactStatus === "error" && (
                    <>
                      {contactError} You can also reach me at{" "}
                      <a href="mailto:abdullahasgerali@gmail.com">my email</a>.
                    </>
                  )}
                  {contactStatus === "idle" && "Your message goes straight to my inbox."}
                </p>
                {contactStatus === "error" && (
                  <a className="form-fallback-link" href={contactFallback}>
                    Open your email app with this message ready <span aria-hidden="true">↗</span>
                  </a>
                )}
              </form>
            </div>
            <a className="contact-link" href="/faq">
              Got a question? Visit the FAQ <span aria-hidden="true">↗</span>
            </a>
          </div>
          <footer className="site-footer">
            <span>© 2026 ABDULLAH ASGER ALI</span>
            <SocialLinks />
            <a href="#top">BACK TO TOP ↑</a>
          </footer>
        </section>
      </main>
    </>
  );
}
