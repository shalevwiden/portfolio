(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const sections = document.querySelectorAll(".section--reveal");
  if (!sections.length || !("IntersectionObserver" in window)) {
    sections.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  sections.forEach((el) => io.observe(el));
})();
