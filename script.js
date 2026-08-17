const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-links a");
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme === "dark") {
        document.body.classList.remove("light-mode");
    }

    function updateThemeButton() {
        const isDark = !document.body.classList.contains("light-mode");
        themeToggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
        themeToggle.setAttribute("aria-pressed", String(isDark));
    }

    themeToggle.addEventListener("click", () => {
        const isLight = document.body.classList.toggle("light-mode");
        localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
        updateThemeButton();
    });

    updateThemeButton();
}

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        navToggle.classList.toggle("open", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.forEach((link) => {
        link.addEventListener("click", () => {
            link.classList.remove("clicked");
            requestAnimationFrame(() => link.classList.add("clicked"));
            setTimeout(() => link.classList.remove("clicked"), 360);
            navLinks.classList.remove("open");
            navToggle.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

function setActiveLink() {
    const scrollY = window.scrollY + 140;
    let current = "inicio";

    sections.forEach((section) => {
        if (scrollY >= section.offsetTop) {
            current = section.id;
        }
    });

    links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
}

window.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();

const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealEls.forEach((el) => observer.observe(el));
} else {
    revealEls.forEach((el) => el.classList.add("visible"));
}
