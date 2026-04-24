/**
 * Top navigation: mobile toggle, body scroll lock, and active section highlighting.
 */
const nav = document.getElementById("main-nav");
const toggle = document.getElementById("nav-toggle");
const navLinks = document.querySelectorAll("[data-nav-link]");
const hero = document.getElementById("hero");

const sectionIds = [
  "about",
  "experience",
  "skills",
  "education",
  "projects",
  "research",
  "volunteer",
  "testimonials",
  "contact",
];

const prefersReducedMotion = () => {
  try {
    if (typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

function setMenuOpen(open) {
  if (!nav || !toggle) return;
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
}

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    setMenuOpen(!isOpen);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setMenuOpen(false);
  });
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 900px)").matches) {
    setMenuOpen(false);
  }
});

function setActiveNavById(id) {
  navLinks.forEach((a) => {
    const isActive = a.getAttribute("href") === `#${id}`;
    if (isActive) {
      a.setAttribute("aria-current", "true");
    } else {
      a.removeAttribute("aria-current");
    }
  });
}

function clearActiveNav() {
  navLinks.forEach((a) => a.removeAttribute("aria-current"));
}

const sectionElements = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (sectionElements.length && "IntersectionObserver" in window) {
  const visibleHero = () => {
    if (!hero) return false;
    const r = hero.getBoundingClientRect();
    // Hero is still the primary visible band at the top of the viewport
    return r.top < window.innerHeight * 0.35 && r.bottom > 64;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (visibleHero()) {
        clearActiveNav();
        return;
      }
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) {
        setActiveNavById(visible[0].target.id);
      }
    },
    { root: null, rootMargin: "-18% 0 -32% 0", threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.75, 1] }
  );
  sectionElements.forEach((el) => observer.observe(el));
}

// Smooth scroll for in-page hash links, respecting reduced motion
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  const href = a.getAttribute("href");
  if (!href || href === "#") return;
  const id = href.slice(1);
  a.addEventListener("click", (e) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    if (prefersReducedMotion()) {
      target.scrollIntoView();
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Hero: rotating typewriter (Typed.js) — see assets/js/vendor/typed.min.js
const HERO_ROLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Researcher",
];

function initHeroRoleTypewriter() {
  const el =
    document.getElementById("hero-role-text") ||
    document.querySelector("#hero-role .hero__role-text");
  if (!el) return;

  if (prefersReducedMotion()) {
    el.textContent = HERO_ROLES.join(" · ");
    return;
  }

  if (typeof window.Typed === "undefined") {
    el.textContent = HERO_ROLES.join(" · ");
    return;
  }

  try {
    new window.Typed(el, {
      strings: HERO_ROLES,
      typeSpeed: 48,
      backSpeed: 32,
      backDelay: 2200,
      startDelay: 200,
      smartBackspace: false,
      loop: true,
      showCursor: false,
      contentType: null,
      autoInsertCss: false,
    });
  } catch {
    el.textContent = HERO_ROLES.join(" · ");
  }
}

initHeroRoleTypewriter();
