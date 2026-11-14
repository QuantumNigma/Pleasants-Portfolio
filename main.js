const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("main section[id]");
const revealEls = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("#contact-form");
const preloader = document.querySelector("#preloader");
const portfolioModal = document.querySelector("#portfolio-modal");
const portfolioInquiryForm = document.querySelector("#portfolio-inquiry-form");
const portfolioInquiryStatus = document.querySelector("#portfolio-inquiry-status");
const portfolioCta = document.querySelector(".footer-cta");
const portfolioModalClose = document.querySelector(".portfolio-modal-close");

const closePortfolioModal = () => {
  if (!portfolioModal) return;
  portfolioModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  portfolioCta?.focus();
};

if (portfolioModal) {
  portfolioCta?.addEventListener("click", () => {
    portfolioModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    portfolioModal.querySelector("input")?.focus();
  });

  portfolioModalClose?.addEventListener("click", closePortfolioModal);
  portfolioModal.addEventListener("click", (event) => {
    if (event.target === portfolioModal) closePortfolioModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && portfolioModal.getAttribute("aria-hidden") === "false") {
      closePortfolioModal();
    }
  });
}

if (portfolioInquiryForm && portfolioInquiryStatus) {
  portfolioInquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = portfolioInquiryForm.querySelector('button[type="submit"]');
    if (!submitButton) return;

    submitButton.disabled = true;
    portfolioInquiryStatus.textContent = "Sending your inquiry...";
    portfolioInquiryStatus.dataset.state = "sending";

    try {
      const response = await fetch(portfolioInquiryForm.action, {
        method: "POST",
        body: new FormData(portfolioInquiryForm),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error(`Inquiry submission failed with status ${response.status}`);
      }

      portfolioInquiryForm.reset();
      portfolioInquiryStatus.textContent = "Thanks for reaching out. We’ll be in touch soon.";
      portfolioInquiryStatus.dataset.state = "success";
    } catch (error) {
      console.error("Could not submit the Quantumnigma inquiry.", error);
      portfolioInquiryStatus.textContent = "We couldn’t send your inquiry. Please try again or email quantumnigma@gmail.com.";
      portfolioInquiryStatus.dataset.state = "error";
    } finally {
      submitButton.disabled = false;
    }
  });
}

if (preloader) {
  const startPreloaderTimer = () => {
    const duration = 2000 + Math.random() * 1000;
    preloader.style.setProperty("--preloader-duration", `${duration}ms`);
    preloader.classList.add("is-loading");
    window.setTimeout(() => preloader.classList.add("fade-out"), duration);
  };

  if (document.readyState === "complete") {
    startPreloaderTimer();
  } else {
    window.addEventListener("load", startPreloaderTimer, { once: true });
  }
}

const setHeaderState = () => {
  header?.classList.toggle("scrolled", window.scrollY > 20);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("open");
    navToggle?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealEls.forEach((el) => revealObserver.observe(el));

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
);

sections.forEach((section) => activeObserver.observe(section));

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button");
    const originalText = button.textContent;

    button.textContent = "Message Ready";
    contactForm.reset();

    window.setTimeout(() => {
      button.textContent = originalText;
    }, 2200);
  });
}
