/* Anisha Anilkumar — Portfolio interactions (vanilla JS, no dependencies) */

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme (light / dark) ---------- */

  var THEME_KEY = "aa-theme";

  function readStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (e) {
      /* storage unavailable — theme simply won't persist */
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var btn = document.getElementById("themeToggle");
    if (btn) {
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  }

  var prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(readStoredTheme() || (prefersDark ? "dark" : "light"));

  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      storeTheme(next);
    });
  }

  /* ---------- Mobile navigation ---------- */

  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function closeMenu() {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    navLinks.addEventListener("click", function (event) {
      if (event.target.tagName === "A") closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  /* ---------- Header border on scroll ---------- */

  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Experience durations (computed from dates) ---------- */

  function monthsBetween(start, end) {
    var months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    // Count the final month when it was worked nearly in full.
    if (end.getDate() - start.getDate() >= 25) months += 1;
    return Math.max(months, 1);
  }

  function formatDuration(months) {
    var years = Math.floor(months / 12);
    var rest = months % 12;
    var parts = [];
    if (years) parts.push(years + (years === 1 ? " yr" : " yrs"));
    if (rest) parts.push(rest + (rest === 1 ? " mo" : " mos"));
    return parts.join(" ");
  }

  var totalMonths = 0;
  var jobs = document.querySelectorAll(".job");
  for (var i = 0; i < jobs.length; i++) {
    var job = jobs[i];
    var start = new Date(job.getAttribute("data-start"));
    var endAttr = job.getAttribute("data-end");
    var end = endAttr ? new Date(endAttr) : new Date();
    if (isNaN(start) || isNaN(end)) continue;

    var months = monthsBetween(start, end);
    totalMonths += months;

    var label = job.querySelector(".job-duration");
    if (label) label.textContent = formatDuration(months);
  }

  var totalYears = Math.floor(totalMonths / 12);
  var statYears = document.getElementById("statYears");
  var heroYears = document.getElementById("heroYears");
  if (totalYears > 0) {
    if (statYears) {
      statYears.setAttribute("data-target", String(totalYears));
      statYears.textContent = totalYears + "+";
    }
    if (heroYears) heroYears.textContent = "over " + totalYears;
  }

  /* ---------- Count-up numbers ---------- */

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-target"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    var duration = 1100;
    var startTime = null;

    function step(now) {
      if (startTime === null) startTime = now;
      var progress = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Scroll-triggered effects ---------- */

  var reveals = document.querySelectorAll(".reveal");
  var counters = document.querySelectorAll(".count");
  var meters = document.querySelectorAll(".meter-bar");

  function fillMeter(bar) {
    bar.style.width = "calc((100% - 3.2rem) * " + Number(bar.getAttribute("data-value")) / 100 + ")";
  }

  if ("IntersectionObserver" in window) {
    var once = function (callback, options) {
      return new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          callback(entry.target);
          observer.unobserve(entry.target);
        });
      }, options);
    };

    var revealObserver = once(function (el) {
      el.classList.add("visible");
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { revealObserver.observe(el); });

    var countObserver = once(animateCount, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });

    var meterObserver = once(fillMeter, { threshold: 0.6 });
    meters.forEach(function (el) { meterObserver.observe(el); });

    /* Highlight the nav link of the section currently in view */
    var linkFor = {};
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
      linkFor[a.getAttribute("href").slice(1)] = a;
    });

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(linkFor).forEach(function (id) {
          linkFor[id].classList.toggle("active", id === entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    document.querySelectorAll("main section[id]").forEach(function (section) {
      sectionObserver.observe(section);
    });
  } else {
    /* Older browsers: show everything immediately */
    reveals.forEach(function (el) { el.classList.add("visible"); });
    meters.forEach(fillMeter);
  }

  /* ---------- Copy email ---------- */

  var copyBtn = document.getElementById("copyEmail");
  var emailLink = document.getElementById("emailLink");
  if (copyBtn && emailLink) {
    copyBtn.addEventListener("click", function () {
      var email = emailLink.textContent.trim();

      function done(ok) {
        copyBtn.textContent = ok ? "Copied" : "Copy failed";
        setTimeout(function () { copyBtn.textContent = "Copy"; }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () { done(true); },
          function () { done(false); }
        );
      } else {
        var field = document.createElement("textarea");
        field.value = email;
        field.setAttribute("readonly", "");
        field.style.position = "absolute";
        field.style.left = "-9999px";
        document.body.appendChild(field);
        field.select();
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
        document.body.removeChild(field);
        done(ok);
      }
    });
  }

  /* ---------- Footer year ---------- */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
