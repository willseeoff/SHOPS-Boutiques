/* =============================================================
   SHOPS Boutiques — Interactions & animations (Vanilla JS)
   Aucune dépendance externe → léger, rapide, 60 FPS.
   ============================================================= */
(() => {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Loader ---------- */
  window.addEventListener("load", () => {
    const loader = $("#loader");
    if (loader) setTimeout(() => loader.classList.add("is-done"), 600);
    document.body.classList.add("is-loaded");
  });

  /* ---------- Année du footer ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Thème clair / sombre ---------- */
  const themeToggle = $("#themeToggle");
  const savedTheme = localStorage.getItem("shops-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
  themeToggle?.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("shops-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("shops-theme", "dark");
    }
  });

  /* ---------- Navbar au scroll + barre de progression ---------- */
  const nav = $("#nav");
  const progress = $("#scrollProgress");
  const toTop = $("#toTop");
  const onScroll = () => {
    const y = window.scrollY;
    nav?.classList.toggle("is-scrolled", y > 40);
    toTop?.classList.toggle("is-visible", y > 600);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const burger = $("#burger");
  const navLinks = $("#navLinks");
  const toggleMenu = (open) => {
    burger?.classList.toggle("is-open", open);
    navLinks?.classList.toggle("is-open", open);
    burger?.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger?.addEventListener("click", () =>
    toggleMenu(!navLinks.classList.contains("is-open"))
  );
  $$(".nav__link").forEach((l) => l.addEventListener("click", () => toggleMenu(false)));

  /* ---------- Retour en haut ---------- */
  toTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
  );

  /* ---------- Apparition au scroll (IntersectionObserver) ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    // léger décalage en cascade pour les groupes de cartes
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const siblings = $$(".reveal", e.target.parentElement);
            const idx = siblings.indexOf(e.target);
            e.target.style.transitionDelay = Math.min(idx * 60, 300) + "ms";
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Parallax discret ---------- */
  const parallaxEls = $$("[data-parallax]");
  if (parallaxEls.length && !prefersReduced) {
    let ticking = false;
    const runParallax = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < vh) {
          const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
          el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      });
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => { if (!ticking) { requestAnimationFrame(runParallax); ticking = true; } },
      { passive: true }
    );
    runParallax();
  }

  /* ---------- Curseur personnalisé ---------- */
  const cursor = $("#cursor");
  const cursorDot = $("#cursorDot");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (cursor && cursorDot && finePointer && !prefersReduced) {
    document.body.classList.add("has-cursor");
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    const loop = () => {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$("a, button, [data-tilt], [data-lightbox]").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
  }

  /* ---------- Boutons magnétiques ---------- */
  if (finePointer && !prefersReduced) {
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Tilt 3D léger sur les cartes ---------- */
  if (finePointer && !prefersReduced) {
    $$("[data-tilt]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `translateY(-10px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Compteurs animés ---------- */
  const counters = $$(".stat__num");
  if (counters.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const suffix = el.dataset.suffix || "";
      const dur = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = (target * eased).toFixed(decimals).replace(".", ",") + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals).replace(".", ",") + suffix;
      };
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach((c) => cio.observe(c));
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------- Slider d'avis ---------- */
  const track = $("#sliderTrack");
  if (track) {
    const slides = $$(".slide", track);
    const dotsWrap = $("#sliderDots");
    let index = 0, timer = null;
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Aller à l'avis " + (i + 1));
      b.addEventListener("click", () => go(i));
      dotsWrap?.appendChild(b);
    });
    const dots = $$("button", dotsWrap);
    const render = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    };
    const go = (i) => { index = (i + slides.length) % slides.length; render(); restart(); };
    const next = () => go(index + 1);
    const prev = () => go(index - 1);
    const restart = () => {
      if (prefersReduced) return;
      clearInterval(timer);
      timer = setInterval(next, 6000);
    };
    $("#nextSlide")?.addEventListener("click", next);
    $("#prevSlide")?.addEventListener("click", prev);
    // pause au survol
    const sliderEl = $("#slider");
    sliderEl?.addEventListener("mouseenter", () => clearInterval(timer));
    sliderEl?.addEventListener("mouseleave", restart);
    render(); restart();
  }

  /* ---------- Lightbox galerie ---------- */
  const lightbox = $("#lightbox");
  if (lightbox) {
    const items = $$("[data-lightbox]");
    const imgEl = $("#lightboxImg");
    let current = 0;
    const getBg = (el) => getComputedStyle(el).backgroundImage;
    const open = (i) => {
      current = i;
      imgEl.style.background = getBg(items[i]);
      imgEl.style.backgroundSize = "cover";
      imgEl.style.backgroundPosition = "center";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    const shift = (dir) => open((current + dir + items.length) % items.length);
    items.forEach((el, i) => el.addEventListener("click", () => open(i)));
    $("#lightboxClose")?.addEventListener("click", close);
    $(".lightbox__next")?.addEventListener("click", () => shift(1));
    $(".lightbox__prev")?.addEventListener("click", () => shift(-1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") shift(1);
      if (e.key === "ArrowLeft") shift(-1);
    });
  }

  /* ---------- Validation du formulaire ---------- */
  const form = $("#contactForm");
  if (form) {
    const note = $("#formNote");
    const setError = (field, msg) => {
      field.classList.toggle("is-error", !!msg);
      const err = $("[data-error]", field);
      if (err) err.textContent = msg || "";
    };
    const validators = {
      name: (v) => v.trim().length >= 2 || "Merci d'indiquer votre nom.",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Adresse email invalide.",
      phone: (v) => v.trim() === "" || /^[+()\d\s.-]{6,}$/.test(v.trim()) || "Numéro de téléphone invalide.",
      message: (v) => v.trim().length >= 10 || "Votre message est un peu court (10 caractères min.).",
    };
    const validateField = (input) => {
      const field = input.closest(".field");
      const rule = validators[input.name];
      if (!rule) return true;
      const res = rule(input.value);
      setError(field, res === true ? "" : res);
      return res === true;
    };
    $$("input, textarea", form).forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("is-error")) validateField(input);
      });
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$("input, textarea", form).forEach((input) => { if (!validateField(input)) ok = false; });
      if (!ok) {
        note.textContent = "Merci de corriger les champs en rouge.";
        note.className = "form__note ko";
        return;
      }
      // Démo front-end : aucun backend branché pour l'instant.
      note.textContent = "Merci ! Votre message est prêt — connectez un service d'envoi (voir README) pour le recevoir.";
      note.className = "form__note ok";
      form.reset();
      $$(".field", form).forEach((f) => f.classList.remove("is-error"));
    });
  }

  /* ---------- Liens légaux (placeholders) ---------- */
  $$("[data-legal]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Page à rédiger : ajoutez vos mentions légales / politique de confidentialité.");
    })
  );
})();
