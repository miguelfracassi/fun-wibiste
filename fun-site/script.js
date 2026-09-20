// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("nav-open");
    });
  }

  // Apoie page auto redirect
  const redirectTarget = document.body.getAttribute("data-redirect");
  if (redirectTarget) {
    const counterEl = document.querySelector("[data-counter]");
    let seconds = 4;
    if (counterEl) counterEl.textContent = seconds;
    const timer = setInterval(() => {
      seconds -= 1;
      if (counterEl) counterEl.textContent = Math.max(seconds, 0);
      if (seconds <= 0) {
        clearInterval(timer);
        window.location.href = redirectTarget;
      }
    }, 1000);
  }
});
