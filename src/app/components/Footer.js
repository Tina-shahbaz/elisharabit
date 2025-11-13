"use client";

import Link from "next/link";
import Image from "next/image";

/* ====== DATA ====== */
const discover = [
  ["Become a Tasker", "/become-a-tasker"],
  ["Services By City", "/services-cities"],
  ["Services Nearby", "/services"],
  ["All Services", "/services"],
  ["Elite Taskers", "/elite-taskers"],
  // ["Help", "/help"],
];

const company = [
  ["About Us", "/about-us"],
  ["Careers", "/Careers"],
  ["Partner with GoZiply", "/partners"],
  ["Press", "/press"],
  ["GoZiply for Good", "/for-good"],
  ["Blog", "/blog"],
  ["Terms & Privacy", "/terms"],
  ["California Consumer Notice", "/ccpa"],
  ["Do Not Sell My Personal Information", "/do-not-sell"],
  ["Legal", "/legal"],
];

/* ====== UI PARTS ====== */
function Social({ href, label, children }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      {children}
    </Link>
  );
}

function StoreBadge({ type = "apple", href = "/apps" }) {
  const isApple = type === "apple";
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 rounded-xl bg-black px-4 py-2.5 text-white ring-1 ring-white/10 transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      aria-label={isApple ? "Download on the App Store" : "Get it on Google Play"}
    >
      {isApple ? (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="shrink-0">
          <path
            fill="currentColor"
            d="M16.5 12.2c0-2.1 1.7-3.1 1.7-3.1-1-.1-2 .6-2.6 1.2-.6.6-1.1 1.5-1.1 2.5 0 1 .5 2 1.1 2.6.6.6 1.6 1.2 2.6 1.1 0 0-1.7-.9-1.7-3.1zM13.6 8.8c.6-.7 1-1.7.8-2.7-.9.1-1.8.6-2.4 1.3-.6.6-1 1.6-.9 2.5.9.1 1.9-.5 2.5-1.1zM12.1 7.7c1.2-1.5 2.9-1.6 2.9-1.6S14 4 12.4 4C10.9 4 10 4.9 9.2 6c-.8 1.2-1.4 3.1-.6 4.8.6 1.4 2.1 3.2 3.5 3.2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.9.7 1.4 0 2.2-1.5 2.6-2.1-2.5-1-2.3-4.7-5.7-4.7-.9 0-1.8.4-2.6 1.5z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="shrink-0">
          <path fill="currentColor" d="M3 2.6v18.8c0 .5.6.8 1 .5l10.5-9.4c.3-.3.3-.7 0-1L4 2.1c-.4-.4-1-.1-1 .5z" />
          <path fill="#34A853" d="M20.8 13.2c.4-.2.4-.8 0-1l-2.3-1.3-2 2 2 2 2.3-1.7z" />
          <path fill="#FBBC05" d="M13.9 8.8 16.5 7l-12-4.9c-.3-.1-.5 0-.5.3v1.9l9.9 4.5z" />
          <path fill="#4285F4" d="M4 20.6c0 .3.2.4.5.3l12-4.9-2.6-1.8L4 18.7v1.9z" />
        </svg>
      )}
      <span className="leading-tight">
        <span className="block text-[11px] opacity-80">
          {isApple ? "Download on the" : "GET IT ON"}
        </span>
        <span className="block text-[15px] font-semibold">
          {isApple ? "App Store" : "Google Play"}
        </span>
      </span>
    </Link>
  );
}

/* ====== MAIN FOOTER ====== */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white w-full">
      {/* Top: logo + socials */}
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-5">
          <div className="flex items-center gap-3">
            {/* ✅ Your custom logo/photo from /public */}
            <Image
              src="/newlogo.png"  // 👈 replace with your actual file name
              alt="My Logo"
              width={150}
              height={60}
              className="rounded-md object-contain p-1"
              priority
            />
          </div>

          {/* Social icons */}
          <div className="flex flex-wrap items-center gap-2 text-sm opacity-90">
            <span className="mr-1">Follow us! We&apos;re friendly:</span>
            <Social href="https://facebook.com" label="Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M22 12a10 10 0 1 0-11.6 9.9v-7H8.2V12h2.2V9.4c0-2.2 1.3-3.4 3.3-3.4.9 0 1.9.17 1.9.17v2.1h-1.1c-1.1 0-1.5.7-1.5 1.4V12h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 22 12z"
                />
              </svg>
            </Social>
            <Social href="https://x.com" label="Twitter / X">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M20.9 2.5 12.9 13l6.9 8.5h-2.8L11.7 14l-5 7.5H3.5l6.6-9.9L3.1 2.5h2.8l6 7.8 5.2-7.8h3.8z" />
              </svg>
            </Social>
            <Social href="https://instagram.com" label="Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"
                />
              </svg>
            </Social>
            <Social href="https://tiktok.com" label="TikTok">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M15 3c1.1 2.2 2.8 3.7 5 4v3c-2.2 0-3.9-.8-5-2v6.7c0 3.8-2.7 6.3-6 6.3S3 18.5 3 15.4 5.7 9 9 9c.7 0 1.5.1 2 .3V12c-.5-.2-1.1-.3-1.7-.3-1.9 0-3.3 1.3-3.3 3.5s1.4 3.5 3.3 3.5 3.4-1.2 3.4-3.3V3h2.3z"
                />
              </svg>
            </Social>
            <Social href="https://linkedin.com" label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9h4v12H3zM14.5 9c-2.2 0-3.5 1.2-4.1 2.3V9H6.5v12H10v-6.3c0-1.7.9-2.7 2.3-2.7 1.3 0 2 .9 2 .7V21h3.5v-7c0-3.7-2-5-3.3-5z"
                />
              </svg>
            </Social>
          </div>
        </div>
      </div>

      {/* Middle: 3 columns */}
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Discover */}
          <nav aria-labelledby="ftr-discover">
            <h3 id="ftr-discover" className="mb-3 text-base font-semibold">
              Discover
            </h3>
            <ul className="space-y-2">
              {discover.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="inline-block hover:underline hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-labelledby="ftr-company">
            <h3 id="ftr-company" className="mb-3 text-base font-semibold">
              Company
            </h3>
            <ul className="space-y-2">
              {company.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="inline-block hover:underline hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Download app */}
          <div aria-labelledby="ftr-app">
            <h3 id="ftr-app" className="mb-3 text-base font-semibold">
              Download our app
            </h3>
            <p className="opacity-90 leading-relaxed">
              Tackle your to-do list wherever you are with our mobile app.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <StoreBadge type="apple" />
              <StoreBadge type="google" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20">
        <div className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm opacity-90">
            <div className="flex flex-wrap items-center gap-2">
              <button className="rounded-md border border-white/25 px-3 py-1.5">Canada</button>
              <span className="text-white/60">•</span>
              <button className="rounded-md border border-white/25 px-3 py-1.5">English</button>
              <span className="text-white/60">•</span>
              <button className="rounded-md border border-white/25 px-3 py-1.5">Français</button>
              <span className="text-white/60">•</span>
              <button className="rounded-md border border-white/25 px-3 py-1.5">CAD</button>
            </div>

            <ul className="flex flex-wrap items-center gap-5">
              <li><Link href="/terms" className="hover:underline hover:text-white">Terms</Link></li>
              <li><Link href="/privacy" className="hover:underline hover:text-white">Privacy</Link></li>
              <li><Link href="/cookies" className="hover:underline hover:text-white">Cookies</Link></li>
            </ul>

            <span>© {year} TaskerCA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
