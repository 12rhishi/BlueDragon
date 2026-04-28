const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const cartCount = document.querySelector("[data-cart-count]");
const flavourImage = document.querySelector("[data-flavour-image]");
const flavourKicker = document.querySelector("[data-flavour-kicker]");
const flavourTitle = document.querySelector("[data-flavour-title]");
const flavourCopy = document.querySelector("[data-flavour-copy]");
const leadForm = document.querySelector("[data-lead-form]");
const formNote = document.querySelector("[data-form-note]");

window.dataLayer = window.dataLayer || [];

const flavours = {
  lime: {
    image: "assets/Lime.png",
    kicker: "Citrus charge",
    title: "Lime Flavoured",
    copy: "Bright, cold, and clean with a citrus snap made for lunch breaks, workouts, and beach-day coolers."
  },
  cranberry: {
    image: "assets/carn.png",
    kicker: "Bold and tangy",
    title: "Cranberry Flavoured",
    copy: "A sharper berry profile with a premium bite, built for people who want their sparkling water to feel alive."
  },
  original: {
    image: "assets/Original%20flavour.png",
    kicker: "Pure and crisp",
    title: "Original Sparkling",
    copy: "Clean sparkling water with a crisp finish for mixers, meals, travel, and straight-from-the-fridge hydration."
  },
  mango: {
    image: "assets/raw%20mango.png",
    kicker: "Kachi kairi spark",
    title: "Raw Mango",
    copy: "A nostalgic raw mango lift with a grown-up sparkling finish, made for Indian palates and summer cravings."
  },
  peach: {
    image: "assets/PEACH.png",
    kicker: "Smooth fruit fizz",
    title: "Peach Flavoured",
    copy: "Soft, juicy, and lightly aromatic with the same zero-calorie, sugar-free Blue Dragon base."
  },
  kokum: {
    image: "assets/Kokum%20Ginger%20Flavour.png",
    kicker: "Spiced coastal hit",
    title: "Kokum-Ginger",
    copy: "A tangy kokum profile with ginger warmth for a flavour that feels distinctive, Indian, and refreshing."
  }
};

let cart = 0;

function trackEvent(eventName, detail = {}) {
  const payload = {
    event: eventName,
    page_path: window.location.pathname,
    ...detail
  };

  window.dataLayer.push(payload);
  document.dispatchEvent(new CustomEvent("blueDragonMarketingEvent", { detail: payload }));
}

function storeCampaignParams() {
  const params = new URLSearchParams(window.location.search);
  const campaign = {};

  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => {
    const value = params.get(key);
    if (value) campaign[key] = value;
  });

  if (Object.keys(campaign).length) {
    localStorage.setItem("blueDragonCampaign", JSON.stringify(campaign));
    trackEvent("campaign_visit", campaign);
  }
}

function handleScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function setFlavour(key) {
  const flavour = flavours[key];
  if (!flavour) return;

  flavourImage.src = flavour.image;
  flavourImage.alt = `Blue Dragon ${flavour.title} sparkling water`;
  flavourKicker.textContent = flavour.kicker;
  flavourTitle.textContent = flavour.title;
  flavourCopy.textContent = flavour.copy;
  trackEvent("flavour_view", { flavour: key, flavour_name: flavour.title });

  document.querySelectorAll("[data-flavour]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.flavour === key);
  });
}

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();
storeCampaignParams();

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.tagName !== "A") return;
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
});

document.querySelectorAll("[data-flavour]").forEach((button) => {
  button.addEventListener("click", () => setFlavour(button.dataset.flavour));
});

document.querySelectorAll("[data-add-cart]").forEach((button) => {
  button.addEventListener("click", () => {
    cart += 1;
    cartCount.textContent = cart;
    trackEvent("add_to_cart", { product_name: button.dataset.product || "Blue Dragon product", cart_count: cart });
    button.textContent = "Added";
    window.setTimeout(() => {
      button.textContent = "Add to cart";
    }, 950);
  });
});

document.querySelectorAll("[data-track]").forEach((element) => {
  element.addEventListener("click", () => {
    trackEvent(element.dataset.track);
  });
});

if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(leadForm);
    const email = String(formData.get("email") || "").trim();

    if (!email) return;

    trackEvent("lead_submit", {
      email_domain: email.split("@")[1] || "unknown"
    });

    leadForm.reset();
    formNote.textContent = "You are on the launch list.";
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
