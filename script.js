// ================================
// Final Dashboard Data (Edit Weekly)
// ================================
const DATA = {
  committees: [
    { name: "لجنة الإشراف والتطوير", avgHours: "XX", icon: "settings" },
    { name: "لجنة المحتوى", avgHours: "XX", icon: "file-text" },
    { name: "لجنة التصميم", avgHours: "XX", icon: "pen-tool" },
    { name: "لجنة إدارة الفعاليات والاستقطاب", avgHours: "XX", icon: "calendar-days" },
    { name: "لجنة التسويق وإدارة مواقع التواصل", avgHours: "XX", icon: "megaphone" },
  ],

  top3: {
    "لجنة الإشراف والتطوير": ["— — —", "— — —", "— — —"],
    "لجنة المحتوى": ["— — —", "— — —", "— — —"],
    "لجنة التصميم": ["— — —", "— — —", "— — —"],
    "لجنة إدارة الفعاليات والاستقطاب": ["— — —", "— — —", "— — —"],
    "لجنة التسويق وإدارة مواقع التواصل": ["— — —", "— — —", "— — —"],
  },

  eliteFive: ["— — —", "— — —", "— — —", "— — —", "— — —"],
};

// ============ Helpers ============
function safeNumber(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function computeWidths(committees) {
  // Visual-only scaling: relative to max numeric avg (when you replace XX with numbers)
  const nums = committees.map(c => safeNumber(c.avgHours)).filter(v => v !== null);
  const max = nums.length ? Math.max(...nums) : null;

  return committees.map(c => {
    const v = safeNumber(c.avgHours);
    if (v === null || max === null || max === 0) return 58; // placeholder visual
    const pct = Math.max(18, Math.min(100, (v / max) * 100));
    return pct;
  });
}

// ============ Render Committees ============
function renderCommittees() {
  const wrap = document.getElementById("committeeCards");
  wrap.innerHTML = "";

  const widths = computeWidths(DATA.committees);

  DATA.committees.forEach((c, idx) => {
    const card = document.createElement("div");
    card.className = "card reveal premium-tilt";
    card.style.animationDelay = `${idx * 60}ms`;

    card.innerHTML = `
      <div class="card-top">
        <h3><i data-lucide="${c.icon}"></i> ${c.name}</h3>
        <span class="badge"><i data-lucide="activity"></i> متابعة أسبوعية</span>
      </div>

      <div class="avg">
        <span class="label">Average Hours</span>
        <span class="value">${c.avgHours}</span>
        <span class="unit">hrs</span>
      </div>

      <div class="progress" aria-label="progress bar">
        <div class="bar" data-target="${widths[idx]}"></div>
      </div>
    `;

    wrap.appendChild(card);
  });

  requestAnimationFrame(() => {
    document.querySelectorAll(".bar").forEach(el => {
      el.style.width = `${el.dataset.target}%`;
    });
  });
}

// ============ Tabs + Top 3 ============
function top3CardHTML(label, icon, person) {
  const isPlaceholder = person.includes("—");
  return `
    <div class="top3-card reveal">
      <div class="rank">
        <i data-lucide="${icon}"></i>
        <span>${label}</span>
      </div>
      <div class="name ${isPlaceholder ? "placeholder" : ""}">
        <i data-lucide="user"></i>
        <span>${person}</span>
      </div>
    </div>
  `;
}

function renderTabs() {
  const tabs = document.getElementById("committeeTabs");
  const panel = document.getElementById("tabPanel");
  tabs.innerHTML = "";
  panel.innerHTML = "";

  const committeeNames = DATA.committees.map(c => c.name);

  function setActive(name) {
    tabs.querySelectorAll(".tab-btn").forEach(btn => {
      const active = btn.dataset.name === name;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    const list = DATA.top3[name] || ["— — —", "— — —", "— — —"];
    panel.innerHTML = `
      <div class="top3">
        ${top3CardHTML("الأول", "award", list[0])}
        ${top3CardHTML("الثاني", "medal", list[1])}
        ${top3CardHTML("الثالث", "badge-check", list[2])}
      </div>
    `;
    lucide.createIcons();
  }

  committeeNames.forEach((name, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tab-btn";
    btn.dataset.name = name;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", "false");
    btn.textContent = name.replace("لجنة ", "");
    btn.addEventListener("click", () => setActive(name));
    tabs.appendChild(btn);

    if (i === 0) setTimeout(() => setActive(name), 0);
  });
}

// ============ Elite Five ============
function renderEliteFive() {
  const wrap = document.getElementById("eliteFive");
  wrap.innerHTML = "";

  DATA.eliteFive.forEach((person, idx) => {
    const card = document.createElement("div");
    card.className = "elite-card reveal";
    card.style.animationDelay = `${idx * 60}ms`;

    card.innerHTML = `
      <div class="u">
        <i data-lucide="user"></i>
        <span>${person}</span>
      </div>
    `;
    wrap.appendChild(card);
  });
}

// ============ Premium Tilt (Mouse) ============
function enableTilt() {
  const cards = document.querySelectorAll(".premium-tilt");

  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rx = ((y / rect.height) - 0.5) * -8; // rotateX
      const ry = ((x / rect.width) - 0.5) * 8;  // rotateY

      card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
    });

    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform .18s ease";
      setTimeout(() => (card.style.transition = ""), 180);
    });
  });
}

// ============ Init ============
function init() {
  document.getElementById("year").textContent = new Date().getFullYear();
  lucide.createIcons();

  renderCommittees();
  renderTabs();
  renderEliteFive();

  // re-run icons after injected HTML
  lucide.createIcons();

  enableTilt();
}

document.addEventListener("DOMContentLoaded", init);
