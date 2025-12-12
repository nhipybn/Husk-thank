const app = document.getElementById("app");

const sections = [
  "sections/header.html",
  "sections/Thankspage.html",
  "sections/hero.html",
  "sections/footer.html",
];

// =====================
// COUNTDOWN
// =====================
function startCountdown() {
  const d = document.getElementById("cd-days");
  if (!d) return;

  const target = new Date("2025-12-23T09:00:00").getTime();

  const update = () => {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      const box = document.getElementById("countdown-box");
      if (box) box.innerHTML = `<span class='text-2xl text-red-600 font-bold'>Webinar đang diễn ra!</span>`;
      return;
    }

    d.textContent = Math.floor(diff / 86400000);
    document.getElementById("cd-hours").textContent = Math.floor((diff % 86400000) / 3600000);
    document.getElementById("cd-mins").textContent = Math.floor((diff % 3600000) / 60000);
    document.getElementById("cd-secs").textContent = Math.floor((diff % 60000) / 1000);
  };

  update();
  setInterval(update, 1000);
}

// =====================
// MOBILE MENU
// =====================
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const nav = document.getElementById("mobile-menu");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => nav.classList.toggle("translate-x-full"));

  document.querySelectorAll(".mobile-link")?.forEach((link) =>
    link.addEventListener("click", () => nav.classList.add("translate-x-full"))
  );
}

// =====================
// HERO VIDEO LAZY-LOAD + SPEED
// =====================
function initHeroVideo() {
  const video = document.getElementById("heroVideo");
  if (!video) return;

  const source = video.querySelector("source");
  const realSrc = source.dataset.src;

  const loadVideo = () => {
    source.src = realSrc;
    video.load();
    video.play();
    video.playbackRate = 1.5;
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadVideo();
      observer.disconnect();
    }
  });

  observer.observe(video);
}

// =====================
// SMOOTH SCROLL ANCHOR
// =====================
function initSmoothScroll() {
  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight : 0;

  document.querySelectorAll('header a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });
}

// =====================
// LOAD ALL SECTIONS + BOWNOW FORM + TRACKING
// =====================
async function loadSections() {
  for (const path of sections) {
    const res = await fetch(path);
    const html = await res.text();
    app.insertAdjacentHTML("beforeend", html);

    // ⭐ Inject BowNow form script chỉ khi load register.html
    if (path === "sections/register.html") {
      setTimeout(() => {
        const container = document.getElementById("bownow-form");
        if (container) {
          const bowNowFormScript = document.createElement("script");
          bowNowFormScript.charset = "utf-8";
          bowNowFormScript.src = "https://contents.bownow.jp/forms/sid_221e4fe9bd5821f527be/trace.js";
          bowNowFormScript.onload = () => console.log("BowNow form loaded");
          container.appendChild(bowNowFormScript);
        }
      }, 50); // delay để chắc DOM đã render
    }
  }

  // After all sections loaded
  initMobileMenu();
  startCountdown();
  initHeroVideo();
  initSmoothScroll();

  // ⭐ Inject BowNow tracking script vào head
  const bowNowTracking = document.createElement("script");
  bowNowTracking.charset = "utf-8";
  bowNowTracking.src = "https://contents.bownow.jp/js/UTC_1d9e0c1d1dcfe0dd1cba/trace.js";
  bowNowTracking.onload = () => console.log("BowNow tracking loaded");
  document.head.appendChild(bowNowTracking);
}

document.addEventListener("DOMContentLoaded", loadSections);
