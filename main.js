(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nav = document.querySelector(".nav");
  var logo = document.getElementById("navLogo");
  var navH = nav ? nav.offsetHeight : 80;
  var logoDark = "billeder/jernbane-logo-creme.png";
  var logoLight = "billeder/jernbane-logo-lys.png";

  document.documentElement.classList.add("js");
  if (nav) window.requestAnimationFrame(function () { nav.classList.add("is-loaded"); });

  function inferTone(section) {
    if (section.dataset.tone) return section.dataset.tone;
    if (section.classList.contains("footer") || section.classList.contains("subpage-hero") || section.classList.contains("daily-hero") || section.classList.contains("catering-section")) return "dark";
    if (section.classList.contains("hosting-section") || section.classList.contains("today-section")) return "signal";
    return "light";
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll("main section, footer"));
  sections.forEach(function (section) {
    if (!section.dataset.tone) section.dataset.tone = inferTone(section);
  });

  function setNavTheme(tone) {
    if (!nav) return;
    var theme = tone === "signal" ? "signal" : tone === "light" ? "light" : "dark";
    nav.classList.remove("nav-theme-dark", "nav-theme-light", "nav-theme-signal");
    nav.classList.add("nav-theme-" + theme);
    if (logo) logo.src = theme === "dark" ? logoDark : logoLight;
  }

  function themeAtNav() {
    if (!sections.length) return;
    var point = navH + 4;
    var active = sections.find(function (section) {
      var box = section.getBoundingClientRect();
      return box.top <= point && box.bottom > point;
    });
    if (!active) {
      active = sections.reduce(function (closest, section) {
        var distance = Math.abs(section.getBoundingClientRect().top - point);
        return distance < closest.distance ? { section: section, distance: distance } : closest;
      }, { section: sections[0], distance: Infinity }).section;
    }
    setNavTheme(active.dataset.tone || "light");
  }

  setNavTheme(sections[0] ? sections[0].dataset.tone : "dark");
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      themeAtNav();
      ticking = false;
    });
  }, { passive: true });
  window.addEventListener("resize", function () {
    navH = nav ? nav.offsetHeight : 80;
    themeAtNav();
  });

  var revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("is-in"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  function openDrawer() {
    if (!drawer || !burger) return;
    drawer.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    var first = drawer.querySelector("a, button");
    if (first) first.focus();
  }
  function closeDrawer() {
    if (!drawer || !burger) return;
    drawer.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  var burger = document.querySelector(".burger");
  var drawer = null;
  if (burger) {
    drawer = document.createElement("aside");
    drawer.id = "mobile-navigation";
    drawer.className = "nav-drawer";
    drawer.setAttribute("aria-label", "Mobilnavigation");
    var close = document.createElement("button");
    close.className = "drawer-close";
    close.type = "button";
    close.setAttribute("aria-label", "Luk menu");
    close.textContent = "×";
    drawer.appendChild(close);
    var drawerLinks = document.querySelectorAll(".nav-links a, .nav-cta");
    drawerLinks.forEach(function (link) {
      var copy = link.cloneNode(true);
      copy.className = "drawer-link";
      drawer.appendChild(copy);
    });
    document.body.appendChild(drawer);
    burger.addEventListener("click", function () { drawer.classList.contains("is-open") ? closeDrawer() : openDrawer(); });
    close.addEventListener("click", closeDrawer);
    drawer.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeDrawer();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeDrawer();
    });
  }

  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(function (link) {
    var href = (link.getAttribute("href") || "").split("#")[0];
    if (href && href === currentPage) link.setAttribute("aria-current", "page");
  });

  var form = document.getElementById("buur-kontaktform");
  if (form) {
    var renderedAt = Date.now();
    var slug = form.getAttribute("data-slug") || "jernbane-cafeen";
    var feedback = form.querySelector(".buur-feedback");
    var submitBtn = form.querySelector("button[type=submit]");
    var originalLabel = submitBtn ? submitBtn.textContent : "Send besked";

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = new FormData(form);
      var honeypot = (data.get("website") || "").toString().trim();
      if (honeypot) {
        if (feedback) feedback.textContent = "Kunne ikke sende lige nu. Prøv igen om lidt.";
        return;
      }
      var details = [];
      var telefon = (data.get("telefon") || "").toString().trim();
      var dato = (data.get("dato") || "").toString().trim();
      var antal = (data.get("antal") || "").toString().trim();
      if (telefon) details.push("Telefon: " + telefon);
      if (dato) details.push("Dato: " + dato);
      if (antal) details.push("Antal gæster: " + antal);
      var body = {
        name: data.get("navn") || "",
        email: data.get("email") || "",
        message: (details.length ? details.join("\n") + "\n\n" : "") + (data.get("besked") || ""),
        honeypot: data.get("website") || "",
        ts: renderedAt
      };
      if (submitBtn) submitBtn.disabled = true;
      if (feedback) feedback.textContent = "Tak for oplysningerne. Previewet er valideret lokalt, men ikke sendt.";
      if (submitBtn) submitBtn.disabled = false;
    });
  }
})();
