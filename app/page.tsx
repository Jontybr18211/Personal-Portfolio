"use client"

import { useEffect } from "react"

import { useState } from "react"

import { useRef } from "react"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, Twitter, Menu, X, Moon, Sun, ExternalLink, Code2, Mail, Phone, MapPin } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const ACCENT = "#8A2BE2" // primary purple
const DARK_BG = "#111111"
const LIGHT_BG = "#F5F5F5"
const LIGHT_TEXT = "#EAEAEA"
const DARK_TEXT = "#333333"

function smoothScrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const HEADER_OFFSET = 88 // approx header height (px)
  const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
  window.scrollTo({ top: y, behavior: "smooth" })
}

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible(true)
        })
      },
      { threshold: 0.15 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      {children}
    </div>
  )
}

const SECTION_IDS = ["home", "about", "skills", "contact"] as const
type SectionId = (typeof SECTION_IDS)[number]
function useActiveSection() {
  const [active, setActive] = useState<SectionId>("home")
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(id)
          })
        },
        { threshold: 0.6 },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])
  return active
}

function Typing({ items, speed = 75, pause = 1200 }: { items: string[]; speed?: number; pause?: number }) {
  const [index, setIndex] = useState(0)
  const [sub, setSub] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = items[index % items.length]
    if (!deleting) {
      if (sub.length < current.length) {
        const t = setTimeout(() => setSub(current.slice(0, sub.length + 1)), speed)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setDeleting(true), pause)
        return () => clearTimeout(t)
      }
    } else {
      if (sub.length > 0) {
        const t = setTimeout(() => setSub(current.slice(0, sub.length - 1)), speed / 1.6)
        return () => clearTimeout(t)
      } else {
        setDeleting(false)
        setIndex((i) => (i + 1) % items.length)
      }
    }
  }, [sub, deleting, index, items, speed, pause])

  return (
    <span>
      <span style={{ color: ACCENT }}>{sub}</span>
      <span
        className="inline-block w-0.5 ml-1 align-middle"
        style={{ backgroundColor: ACCENT, animation: "blink 1s step-end infinite", height: "1em" }}
      />
      <style jsx>{`
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark" || !theme
  const Icon = isDark ? Sun : Moon
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-md border"
      style={{ borderColor: ACCENT }}
    >
      <Icon className="h-5 w-5 transition-transform duration-300" style={{ color: ACCENT }} />
    </button>
  )
}

function Navbar({ active }: { active: SectionId }) {
  const [open, setOpen] = useState(false)
  const links = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ] as const

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: "rgba(0,0,0,0.35)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            smoothScrollTo("home")
          }}
          className="font-extrabold text-2xl md:text-3xl leading-tight whitespace-nowrap hover:opacity-90"
          style={{ color: LIGHT_TEXT }}
        >
          <span className="transition-colors" style={{ color: active === "home" ? ACCENT : LIGHT_TEXT }}>
            Soumaditya Deb
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map(({ id, label }) => (
            <Link
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                smoothScrollTo(id)
              }}
              aria-current={active === id ? "page" : undefined}
              className="text-sm"
              style={{
                color: active === id ? ACCENT : LIGHT_TEXT,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (active !== id) (e.currentTarget as HTMLAnchorElement).style.color = ACCENT
              }}
              onMouseLeave={(e) => {
                if (active !== id) (e.currentTarget as HTMLAnchorElement).style.color = LIGHT_TEXT
              }}
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        <button
          className="md:hidden p-2 rounded-md border"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" style={{ color: LIGHT_TEXT }} />
        </button>

        {/* Mobile Drawer */}
        <div
          className={`fixed inset-0 z-50 transition ${open ? "visible" : "invisible"}`}
          aria-hidden={!open}
          onClick={() => setOpen(false)}
        >
          <div className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
          <aside
            className={`absolute right-0 top-0 h-full w-72 shadow-xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
            style={{ backgroundColor: DARK_BG, borderLeft: "1px solid rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <span className="font-semibold" style={{ color: LIGHT_TEXT }}>
                Menu
              </span>
              <button
                className="p-2 rounded-md border"
                style={{ borderColor: "rgba(255,255,255,0.15)" }}
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" style={{ color: LIGHT_TEXT }} />
              </button>
            </div>
            <div className="flex flex-col p-4 gap-4">
              {links.map(({ id, label }) => (
                <Link
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    smoothScrollTo(id)
                    setOpen(false)
                  }}
                  className="text-left text-base py-2 rounded-md"
                  style={{
                    color: active === id ? ACCENT : LIGHT_TEXT,
                  }}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-2">
                <ThemeToggle />
              </div>
            </div>
          </aside>
        </div>
      </nav>
    </header>
  )
}

function SocialIcon({
  href,
  children,
  label,
}: {
  href: string
  children: React.ReactNode
  label: string
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="h-10 w-10 rounded-full flex items-center justify-center border transition-transform"
      style={{ borderColor: ACCENT, color: ACCENT }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = ACCENT
        e.currentTarget.style.color = "#ffffff"
        e.currentTarget.style.transform = "translateY(-3px)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent"
        e.currentTarget.style.color = ACCENT
        e.currentTarget.style.transform = "translateY(0)"
      }}
    >
      {children}
    </a>
  )
}

function Hero() {
  return (
    <section id="home" className="min-h-[92vh] flex items-center scroll-mt-28">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10 items-center">
        <FadeInSection className="order-2 md:order-1">
          <h1 className="text-pretty font-bold leading-tight" style={{ fontSize: "3rem", color: LIGHT_TEXT }}>
            Hi, I'm Soumaditya
          </h1>
          <p
            className="mt-3 text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight"
            style={{ color: LIGHT_TEXT }}
          >
            And I&apos;m a <Typing items={["AI-ML Engineer", "Software Engineer", "Full Stack Developer"]} />
          </p>
          <p className="mt-5 text-base leading-relaxed" style={{ color: LIGHT_TEXT }}>
            {
              "A curious and driven AI/ML enthusiast with a passion for leveraging technology to solve complex, real-world problems. I have hands-on experience in fields like Natural Language Processing and Computer Vision, where I enjoy transforming raw data into actionable insights and building intelligent systems from the ground up. Let’s connect and build something amazing together!"
            }
          </p>

          <div className="mt-6 flex items-center gap-4">
            <SocialIcon href="https://github.com/Jontybr18211" label="GitHub">
              <Github className="h-5 w-5" />
            </SocialIcon>
            <SocialIcon href="https://www.linkedin.com/in/soumaditya-deb-5245b8359" label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </SocialIcon>
            <SocialIcon href="https://x.com/Jonty0073" label="X">
              <Twitter className="h-5 w-5" />
            </SocialIcon>

            <Button
              variant="ghost"
              className="ml-2"
              style={{
                borderColor: ACCENT,
                color: ACCENT,
                borderWidth: 1,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = ACCENT
                e.currentTarget.style.color = "#ffffff"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.color = ACCENT
              }}
            >
              Download CV
            </Button>
          </div>
        </FadeInSection>

        <FadeInSection className="order-1 md:order-2 flex justify-center">
          <div
            className="relative h-64 w-64 md:h-80 md:w-80 rounded-full overflow-hidden flex items-center justify-center"
            style={{
              boxShadow: `0 0 30px ${ACCENT}55, 0 0 60px ${ACCENT}33`,
              border: `2px solid ${ACCENT}`,
              animation: "glow 3s ease-in-out infinite",
            }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/123%20anime.jpg-plRjRrZ4RpCjV9UG9CdRkWtZlvWUAa.jpeg"
              alt="Profile picture of Soumaditya Deb"
              fill
              sizes="(min-width: 768px) 20rem, 16rem"
              className="object-cover"
              unoptimized
            />
            <style jsx>{`
              @keyframes glow {
                0%, 100% { box-shadow: 0 0 30px ${ACCENT}55, 0 0 60px ${ACCENT}33; }
                50% { box-shadow: 0 0 45px ${ACCENT}88, 0 0 80px ${ACCENT}55; }
              }
            `}</style>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-semibold text-pretty" style={{ color: LIGHT_TEXT }}>
        {title}
      </h2>
      <div className="mx-auto mt-2 h-1 w-16 rounded-full" style={{ backgroundColor: ACCENT }} />
    </div>
  )
}

function About() {
  return (
    <section id="about" className="py-16 scroll-mt-28">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-8 items-center">
        <FadeInSection>
          <div className="rounded-xl overflow-hidden">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-K0xPTiaq0N1aenkV2rZvP0Gc74zK2Q.png"
              alt="Green cyber-themed illustration of a hooded figure at a laptop with code visuals"
              width={1920}
              height={1080}
              unoptimized
              className="w-full h-auto"
            />
          </div>
        </FadeInSection>
        <FadeInSection>
          <SectionHeading title="About Me" />
          <p className="mt-4 leading-relaxed" style={{ color: LIGHT_TEXT }}>
            {
              "I'm an AI/ML and full-stack developer focused on building intelligent, user-centered products. Built an ML-powered crossword solver using NLTK and WordNet and a Gesture based volume control system using OpenCV. Proficient in Python, scikit-learn a strong foundation in OOPs and advanced programming concepts.I love solving complex problems, shipping reliable software, and learning in public."
            }
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Code2 className="h-5 w-5" />,
                title: "Trainings",
                value: "Undergrad",
                href: "/experience",
              },
              { icon: <ExternalLink className="h-5 w-5" />, title: "Projects", value: "20+ Completed" },
              { icon: <Mail className="h-5 w-5" />, title: "Open To", value: "Opportunities" },
            ].map((card, i) =>
              card.href ? (
                <Link
                  key={i}
                  href={card.href}
                  aria-label="Open Experience and Trainings"
                  className="rounded-lg p-4 border transition-colors block"
                  style={{ borderColor: "rgba(255,255,255,0.12)", color: LIGHT_TEXT }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = ACCENT
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)"
                  }}
                >
                  <div className="flex items-center gap-2" style={{ color: ACCENT }}>
                    {card.icon}
                    <span className="text-sm font-medium">{card.title}</span>
                  </div>
                  <div className="mt-1 text-lg font-semibold">{card.value}</div>
                </Link>
              ) : (
                <div
                  key={i}
                  className="rounded-lg p-4 border transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.12)", color: LIGHT_TEXT }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = ACCENT)}
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.12)")
                  }
                >
                  <div className="flex items-center gap-2" style={{ color: ACCENT }}>
                    {card.icon}
                    <span className="text-sm font-medium">{card.title}</span>
                  </div>
                  <div className="mt-1 text-lg font-semibold">{card.value}</div>
                </div>
              ),
            )}
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

const skills = [
  { name: "React", icon: "/react-logo.png" },
  { name: "Next.js", icon: "/nextjs-logo.png" },
  { name: "Node.js", icon: "/nodejs-logo.png" },
  { name: "Python", icon: "/python-logo.png" },
  { name: "TensorFlow", icon: "/tensorflow-logo.png" },
  { name: "PyTorch", icon: "/pytorch-logo.png" },
  { name: "Tailwind", icon: "/tailwind-logo.png" },
  { name: "Postgres", icon: "/postgresql-logo.png" },
  { name: "Flask", icon: "/logos/flask.png" },
  { name: "OpenCV", icon: "/logos/opencv.png" },
  { name: "Scikit-learn", icon: "/logos/scikit-learn.png" },
  { name: "Colab", icon: "/logos/colab.png" },
]
function Skills() {
  return (
    <section id="skills" className="py-16 scroll-mt-28">
      <div className="mx-auto max-w-6xl px-4">
        <FadeInSection>
          <SectionHeading title="My Skills" />
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {skills.map((s, i) => (
              <div
                key={s.name}
                className="rounded-xl p-4 shadow-sm border transition-all skill-card"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.12)",
                  animationDelay: `${i * 80}ms`,
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)"
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 10px 24px -8px ${ACCENT}55`
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = ACCENT
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = "none"
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.12)"
                }}
              >
                <div className="h-16 w-16 mx-auto">
                  <Image
                    src={s.icon || "/placeholder.svg"}
                    alt={`${s.name} logo`}
                    width={64}
                    height={64}
                    className="mx-auto skill-icon"
                  />
                </div>
                <div className="mt-3 text-center font-medium" style={{ color: LIGHT_TEXT }}>
                  {s.name}
                </div>
              </div>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="py-16 scroll-mt-28">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10">
        <FadeInSection>
          <SectionHeading title="Get in Touch" />
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5" style={{ color: ACCENT }} />
              <a href="mailto:debsoumaditya@gmail.com" className="underline" style={{ color: LIGHT_TEXT }}>
                debsoumaditya@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5" style={{ color: ACCENT }} />
              <span style={{ color: LIGHT_TEXT }}>+91 • Available on request</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5" style={{ color: ACCENT }} />
              <span style={{ color: LIGHT_TEXT }}>India (Remote-friendly)</span>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              alert("Thanks! Your message has been captured locally in this demo.")
            }}
          >
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm" style={{ color: LIGHT_TEXT }}>
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="rounded-md px-3 py-2 bg-transparent border focus:outline-none"
                style={{
                  borderColor: "rgba(255,255,255,0.2)",
                  color: LIGHT_TEXT,
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = ACCENT
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${ACCENT}22`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
                  e.currentTarget.style.boxShadow = "none"
                }}
                placeholder="Your name"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm" style={{ color: LIGHT_TEXT }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                className="rounded-md px-3 py-2 bg-transparent border focus:outline-none"
                style={{
                  borderColor: "rgba(255,255,255,0.2)",
                  color: LIGHT_TEXT,
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = ACCENT
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${ACCENT}22`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
                  e.currentTarget.style.boxShadow = "none"
                }}
                placeholder="you@example.com"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm" style={{ color: LIGHT_TEXT }}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="rounded-md px-3 py-2 bg-transparent border focus:outline-none"
                style={{
                  borderColor: "rgba(255,255,255,0.2)",
                  color: LIGHT_TEXT,
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = ACCENT
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${ACCENT}22`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
                  e.currentTarget.style.boxShadow = "none"
                }}
                placeholder="How can I help?"
              />
            </div>

            <Button
              type="submit"
              variant="ghost"
              style={{
                borderColor: ACCENT,
                color: ACCENT,
                borderWidth: 1,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = ACCENT
                e.currentTarget.style.color = "#ffffff"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.color = ACCENT
              }}
            >
              Send Message
            </Button>
          </form>
        </FadeInSection>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col items-center gap-4">
        <div className="font-medium" style={{ color: LIGHT_TEXT }}>
          Soumaditya Deb
        </div>
        <div className="flex items-center gap-4">
          <SocialIcon href="https://github.com/Jontybr18211" label="GitHub">
            <Github className="h-5 w-5" />
          </SocialIcon>
          <SocialIcon href="https://www.linkedin.com/in/soumaditya-deb-5245b8359" label="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </SocialIcon>
          <SocialIcon href="https://x.com/Jonty0073" label="X">
            <Twitter className="h-5 w-5" />
          </SocialIcon>
        </div>
        <div className="text-xs" style={{ color: LIGHT_TEXT }}>
          © {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default function Page() {
  const active = useActiveSection()

  useEffect(() => {
    // prefer system/user theme handled by next-themes; this sets body background for demo
    const root = document.documentElement
    const isDark = root.classList.contains("dark") || !root.classList.contains("light")
    document.body.style.backgroundColor = isDark ? DARK_BG : LIGHT_BG
    document.body.style.color = isDark ? LIGHT_TEXT : DARK_TEXT

    // enable smooth scrolling globally
    document.documentElement.style.scrollBehavior = "smooth"
    document.documentElement.style.scrollPaddingTop = "88px"
  }, [])

  return (
    <main>
      <Navbar active={active} />
      <Hero />
      <About />
      <Skills />
      <Contact />
      <Footer />
    </main>
  )
}
