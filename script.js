const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-links a");

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });

    links.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
        });
    });
}

function setActiveLink() {
    const scrollY = window.scrollY + 120;
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

window.addEventListener("scroll", setActiveLink);
setActiveLink();

/* Ojo weirdcore: aparece / crece / se achica / desaparece al azar */
(function weirdEyeBlink() {
    const eye = document.getElementById("weirdEye");
    const eyeEvent = document.getElementById("eyeEvent");
    const eyeEventGif = document.getElementById("eyeEventGif");
    if (!eye || !eyeEvent || !eyeEventGif) return;

    const FADE_IN_MS = 1100;
    const HOLD_MS = 900;
    const FADE_OUT_MS = 900;
    const EVENT_HOLD_MS = 5000;

    let locked = false;
    let timers = [];

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function clearTimers() {
        timers.forEach(clearTimeout);
        timers = [];
    }

    function later(fn, ms) {
        const id = setTimeout(fn, ms);
        timers.push(id);
        return id;
    }

    function placeEye() {
        const pad = 24;
        const w = eye.offsetWidth || 100;
        const h = eye.offsetHeight || 80;
        const maxX = Math.max(pad, window.innerWidth - w - pad);
        const maxY = Math.max(pad, window.innerHeight - h - pad);
        eye.style.left = rand(pad, maxX) + "px";
        eye.style.top = rand(pad, maxY) + "px";
    }

    function setClickable(on) {
        eye.classList.toggle("clickable", on);
    }

    function hideReset() {
        eye.classList.remove("visible", "shrink");
        eye.style.opacity = "";
        eye.style.transform = "";
        setClickable(false);
    }

    function blink() {
        if (locked) return;

        placeEye();
        hideReset();

        requestAnimationFrame(() => {
            eye.classList.add("visible");
            setClickable(true);
        });

        later(() => {
            if (locked) return;
            eye.classList.remove("visible");
            eye.classList.add("shrink");
            setClickable(false);
        }, FADE_IN_MS + HOLD_MS);

        later(() => {
            if (locked) return;
            hideReset();
            scheduleNext();
        }, FADE_IN_MS + HOLD_MS + FADE_OUT_MS);
    }

    function scheduleNext() {
        if (locked) return;
        const wait = rand(5000, 10000);
        later(blink, wait);
    }

    const eyeEventFx = document.getElementById("eyeEventFx");
    let floatRaf = 0;
    let floatEls = [];

    function clearFx() {
        if (floatRaf) {
            cancelAnimationFrame(floatRaf);
            floatRaf = 0;
        }
        floatEls = [];
        if (eyeEventFx) eyeEventFx.innerHTML = "";
    }

    function spawnFx() {
        if (!eyeEventFx) return;
        clearFx();

        const textCount = 5;
        const gifCount = 2;
        const now = performance.now();

        for (let i = 0; i < textCount; i++) {
            const el = document.createElement("img");
            el.src = "img/textosweirdcore.png";
            el.alt = "";
            el.className = "fx-float is-text";
            el.style.left = rand(2, 78) + "vw";
            el.style.top = rand(4, 78) + "vh";
            eyeEventFx.appendChild(el);

            floatEls.push({
                el,
                x: parseFloat(el.style.left),
                y: parseFloat(el.style.top),
                vx: rand(-0.045, 0.045),
                vy: rand(-0.04, 0.04),
                wiggle: rand(0.8, 1.6),
                phase: rand(0, Math.PI * 2),
                born: now + i * 120
            });
        }

        for (let i = 0; i < gifCount; i++) {
            const el = document.createElement("img");
            el.src = "img/giftexto.gif?" + Date.now() + i;
            el.alt = "";
            el.className = "fx-float is-gif";
            el.style.left = rand(5, 70) + "vw";
            el.style.top = rand(8, 70) + "vh";
            eyeEventFx.appendChild(el);

            floatEls.push({
                el,
                x: parseFloat(el.style.left),
                y: parseFloat(el.style.top),
                vx: rand(-0.03, 0.03),
                vy: rand(-0.028, 0.028),
                wiggle: rand(0.5, 1.1),
                phase: rand(0, Math.PI * 2),
                born: now + 200 + i * 180
            });
        }

        requestAnimationFrame(() => {
            floatEls.forEach((f) => f.el.classList.add("show"));
        });

        function tick(t) {
            floatEls.forEach((f) => {
                if (t < f.born) return;

                f.x += f.vx + Math.sin((t / 180) + f.phase) * 0.012 * f.wiggle;
                f.y += f.vy + Math.cos((t / 160) + f.phase) * 0.012 * f.wiggle;

                if (f.x < -5) f.x = 95;
                if (f.x > 95) f.x = -5;
                if (f.y < -5) f.y = 95;
                if (f.y > 95) f.y = -5;

                f.el.style.left = f.x + "vw";
                f.el.style.top = f.y + "vh";
            });
            floatRaf = requestAnimationFrame(tick);
        }

        floatRaf = requestAnimationFrame(tick);
    }

    function endEvent() {
        clearFx();
        eyeEvent.classList.remove("show-gif", "active");
        eyeEvent.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        locked = false;
        hideReset();
        scheduleNext();
    }

    function startEvent() {
        if (locked || !eye.classList.contains("visible")) return;

        locked = true;
        clearTimers();
        hideReset();

        document.body.style.overflow = "hidden";
        eyeEvent.setAttribute("aria-hidden", "false");
        eyeEvent.classList.add("active");

        const src = eyeEventGif.getAttribute("src").split("?")[0];
        eyeEventGif.setAttribute("src", src + "?" + Date.now());

        requestAnimationFrame(() => {
            eyeEvent.classList.add("show-gif");
            spawnFx();
        });

        later(endEvent, EVENT_HOLD_MS);
    }

    eye.addEventListener("click", startEvent);
    scheduleNext();
})();
